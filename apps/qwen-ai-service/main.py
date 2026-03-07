import os
import io
import logging
from contextlib import asynccontextmanager

import httpx
import torch
from PIL import Image
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import Qwen2VLForConditionalGeneration, AutoProcessor
from qwen_vl_utils import process_vision_info

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MODEL_SIZES = {
    "2b": "Qwen/Qwen2-VL-2B-Instruct",
    "7b": "Qwen/Qwen2-VL-7B-Instruct",
    "72b": "Qwen/Qwen2-VL-72B-Instruct",
}

MODEL_SIZE = os.getenv("MODEL_SIZE", "2b").lower()
MODEL_NAME = MODEL_SIZES.get(MODEL_SIZE, MODEL_SIZES["2b"])
MAX_BATCH_SIZE = int(os.getenv("MAX_BATCH_SIZE", "16"))

model = None
processor = None
device = None
dtype = None

CAPTION_PROMPT = (
    "Describe this image in one detailed paragraph. "
    "Include the setting, people, how many, gender, objects, actions, colors, and mood. If the image is not clear, describe what you can see."
)

TAGS_PROMPT = (
    "List the key objects, people, and elements visible in this image as comma-separated tags. "
    "Only output the tags, nothing else. Example: man, woman, dog, park, tree, sunlight"
)


def get_device():
    if torch.cuda.is_available():
        return torch.device("cuda")
    elif torch.backends.mps.is_available():
        return torch.device("mps")
    return torch.device("cpu")


@asynccontextmanager
async def lifespan(app: FastAPI):
    global model, processor, device, dtype
    logger.info(f"Loading Qwen2-VL model: {MODEL_NAME} (size: {MODEL_SIZE})")
    device = get_device()
    dtype = torch.float16 if device.type == "cuda" else torch.float32

    if device.type == "mps":
        dtype = torch.float32

    logger.info(f"Using device: {device}, dtype: {dtype}")

    processor = AutoProcessor.from_pretrained(MODEL_NAME)
    model = Qwen2VLForConditionalGeneration.from_pretrained(
        MODEL_NAME,
        torch_dtype=dtype,
        device_map="auto" if device.type == "cuda" else None,
    )
    if device.type != "cuda":
        model = model.to(device)
    model.eval()

    logger.info("Qwen2-VL model loaded successfully")
    yield
    logger.info("Shutting down Qwen2-VL service")


app = FastAPI(
    title="Qwen2-VL Captioning Service",
    description="Generates captions and tags for images using Qwen2-VL",
    version="2.0.0",
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


async def fetch_image_bytes(url: str) -> bytes:
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.get(url)
        response.raise_for_status()
        return response.content


def run_qwen_prompt(image: Image.Image, prompt: str) -> str:
    messages = [
        {
            "role": "user",
            "content": [
                {"type": "image", "image": image},
                {"type": "text", "text": prompt},
            ],
        }
    ]

    text = processor.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
    image_inputs, video_inputs = process_vision_info(messages)

    inputs = processor(
        text=[text],
        images=image_inputs,
        videos=video_inputs,
        padding=True,
        return_tensors="pt",
    ).to(device)

    with torch.no_grad():
        generated_ids = model.generate(**inputs, max_new_tokens=512)
        # Trim the input tokens from the output
        generated_ids_trimmed = [
            out_ids[len(in_ids):]
            for in_ids, out_ids in zip(inputs.input_ids, generated_ids)
        ]
        output = processor.batch_decode(
            generated_ids_trimmed,
            skip_special_tokens=True,
            clean_up_tokenization_spaces=False,
        )[0]

    return output.strip()


def parse_tags(raw: str) -> list[str]:
    """Parse comma-separated tags from model output, cleaning up noise."""
    tags = [t.strip().lower().rstrip(".") for t in raw.split(",")]
    tags = [t for t in tags if t and len(t) < 50]
    # Deduplicate while preserving order
    seen = set()
    unique = []
    for t in tags:
        if t not in seen:
            seen.add(t)
            unique.append(t)
    return sorted(unique)


def caption_single(image: Image.Image) -> CaptionResponse:
    caption = run_qwen_prompt(image, CAPTION_PROMPT)
    tags_raw = run_qwen_prompt(image, TAGS_PROMPT)
    tags = parse_tags(tags_raw)
    return CaptionResponse(caption=caption, tags=tags)


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "model": MODEL_NAME,
        "model_size": MODEL_SIZE,
        "device": str(device),
    }


@app.post("/caption", response_model=CaptionResponse)
async def caption(request: CaptionRequest):
    try:
        image_bytes = await fetch_image_bytes(request.image_url)
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
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
            image_bytes = await fetch_image_bytes(url)
            image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            results.append(caption_single(image))
        return CaptionBatchResponse(results=results)
    except httpx.HTTPError as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch image: {str(e)}")
    except Exception as e:
        logger.exception("Error captioning images")
        raise HTTPException(status_code=500, detail=f"Batch captioning failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("QWEN_SERVICE_PORT", "8002"))
    uvicorn.run(app, host="0.0.0.0", port=port)
