import os
import sys
import io
import logging
import types
from contextlib import asynccontextmanager

# Florence-2's custom code does `import flash_attn` at module load time.
# On non-CUDA machines flash_attn can't be installed, so we register a
# lightweight stub that lets the import succeed. Florence-2 checks for the
# actual flash_attn functions at runtime and falls back to SDPA when they
# are missing.
if "flash_attn" not in sys.modules:
    from importlib.machinery import ModuleSpec

    _stub = types.ModuleType("flash_attn")
    _stub.__spec__ = ModuleSpec("flash_attn", None)
    _stub.__version__ = "0.0.0"
    sys.modules["flash_attn"] = _stub

    _bert = types.ModuleType("flash_attn.bert_padding")
    _bert.__spec__ = ModuleSpec("flash_attn.bert_padding", None)
    sys.modules["flash_attn.bert_padding"] = _bert

import httpx
import torch
from PIL import Image
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import AutoProcessor, AutoModelForCausalLM

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MODEL_NAME = "microsoft/Florence-2-large"
MAX_BATCH_SIZE = int(os.getenv("MAX_BATCH_SIZE", "16"))

model = None
processor = None
device = None
dtype = None


def get_device():
    if torch.cuda.is_available():
        return torch.device("cuda")
    elif torch.backends.mps.is_available():
        return torch.device("mps")
    return torch.device("cpu")


@asynccontextmanager
async def lifespan(app: FastAPI):
    global model, processor, device, dtype
    logger.info(f"Loading Florence-2 model: {MODEL_NAME}")
    device = get_device()
    dtype = torch.float16 if device.type == "cuda" else torch.float32
    logger.info(f"Using device: {device}, dtype: {dtype}")

    processor = AutoProcessor.from_pretrained(MODEL_NAME, trust_remote_code=True)
    model = AutoModelForCausalLM.from_pretrained(
        MODEL_NAME, torch_dtype=dtype, trust_remote_code=True, attn_implementation="sdpa"
    ).to(device)
    model.eval()

    logger.info("Florence-2 model loaded successfully")
    yield
    logger.info("Shutting down Florence-2 service")


app = FastAPI(
    title="Florence-2 Captioning Service",
    description="Generates captions and tags for images using Florence-2",
    version="1.0.0",
    lifespan=lifespan,
)


class CaptionRequest(BaseModel):
    image_url: str


class CaptionBatchRequest(BaseModel):
    image_urls: list[str]


class CaptionResponse(BaseModel):
    caption: str
    tags: list[str]


class CaptionBatchResponse(BaseModel):
    results: list[CaptionResponse]


async def fetch_image(url: str) -> Image.Image:
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.get(url)
        response.raise_for_status()
        return Image.open(io.BytesIO(response.content)).convert("RGB")


def run_florence_task(image: Image.Image, task: str) -> str:
    inputs = processor(text=task, images=image, return_tensors="pt").to(device, dtype)
    with torch.no_grad():
        generated_ids = model.generate(
            input_ids=inputs["input_ids"],
            pixel_values=inputs["pixel_values"],
            max_new_tokens=1024,
            num_beams=3,
        )
    result = processor.batch_decode(generated_ids, skip_special_tokens=False)[0]
    parsed = processor.post_process_generation(result, task=task, image_size=(image.width, image.height))
    return parsed


def caption_single(image: Image.Image) -> CaptionResponse:
    # Get detailed caption
    caption_result = run_florence_task(image, "<MORE_DETAILED_CAPTION>")
    caption = caption_result.get("<MORE_DETAILED_CAPTION>", "")

    # Get object detection labels as tags
    od_result = run_florence_task(image, "<OD>")
    od_data = od_result.get("<OD>", {})
    raw_labels = od_data.get("labels", [])
    tags = sorted(set(label.lower() for label in raw_labels))

    return CaptionResponse(caption=caption, tags=tags)


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "model": MODEL_NAME,
        "device": str(device),
    }


@app.post("/caption", response_model=CaptionResponse)
async def caption(request: CaptionRequest):
    try:
        image = await fetch_image(request.image_url)
        return caption_single(image)
    except httpx.HTTPError as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch image: {str(e)}")
    except Exception as e:
        logger.exception("Error captioning image")
        raise HTTPException(status_code=500, detail=f"Captioning failed: {str(e)}")


@app.post("/caption/batch", response_model=CaptionBatchResponse)
async def caption_batch(request: CaptionBatchRequest):
    if len(request.image_urls) > MAX_BATCH_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"Batch size exceeds maximum of {MAX_BATCH_SIZE}",
        )

    try:
        results = []
        for url in request.image_urls:
            image = await fetch_image(url)
            results.append(caption_single(image))
        return CaptionBatchResponse(results=results)
    except httpx.HTTPError as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch image: {str(e)}")
    except Exception as e:
        logger.exception("Error captioning images")
        raise HTTPException(status_code=500, detail=f"Batch captioning failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("FLORENCE_SERVICE_PORT", "8002"))
    uvicorn.run(app, host="0.0.0.0", port=port)
