import os
import io
import logging
from typing import Optional
from contextlib import asynccontextmanager

import httpx
import torch
from PIL import Image
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import AutoProcessor, AutoModel

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MODEL_NAME = "google/siglip-so400m-patch14-384"
EMBEDDING_DIM = 1152
MAX_BATCH_SIZE = int(os.getenv("MAX_BATCH_SIZE", "32"))

model = None
processor = None
device = None


def get_device():
    if torch.cuda.is_available():
        return torch.device("cuda")
    elif torch.backends.mps.is_available():
        return torch.device("mps")
    return torch.device("cpu")


@asynccontextmanager
async def lifespan(app: FastAPI):
    global model, processor, device
    logger.info(f"Loading SigLIP model: {MODEL_NAME}")
    device = get_device()
    logger.info(f"Using device: {device}")

    processor = AutoProcessor.from_pretrained(MODEL_NAME)
    model = AutoModel.from_pretrained(MODEL_NAME).to(device)
    model.eval()

    logger.info("SigLIP model loaded successfully")
    yield
    logger.info("Shutting down SigLIP service")


app = FastAPI(
    title="SigLIP Inference Service",
    description="Generates image and text embeddings using SigLIP",
    version="1.0.0",
    lifespan=lifespan,
)


class ImageEmbedRequest(BaseModel):
    image_url: str


class ImageEmbedBatchRequest(BaseModel):
    image_urls: list[str]


class TextEmbedRequest(BaseModel):
    text: str


class TextEmbedBatchRequest(BaseModel):
    texts: list[str]


class EmbeddingResponse(BaseModel):
    embedding: list[float]


class BatchEmbeddingResponse(BaseModel):
    embeddings: list[list[float]]


async def fetch_image(url: str) -> Image.Image:
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.get(url)
        response.raise_for_status()
        return Image.open(io.BytesIO(response.content)).convert("RGB")


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "model": MODEL_NAME,
        "device": str(device),
        "embedding_dim": EMBEDDING_DIM,
    }


@app.post("/embed-image", response_model=EmbeddingResponse)
async def embed_image(request: ImageEmbedRequest):
    try:
        image = await fetch_image(request.image_url)
        inputs = processor(images=image, return_tensors="pt").to(device)

        with torch.no_grad():
            image_features = model.get_image_features(**inputs)
            embedding = image_features[0].cpu().numpy().tolist()

        return EmbeddingResponse(embedding=embedding)
    except httpx.HTTPError as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch image: {str(e)}")
    except Exception as e:
        logger.exception("Error embedding image")
        raise HTTPException(status_code=500, detail=f"Embedding failed: {str(e)}")


@app.post("/embed-image/batch", response_model=BatchEmbeddingResponse)
async def embed_image_batch(request: ImageEmbedBatchRequest):
    if len(request.image_urls) > MAX_BATCH_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"Batch size exceeds maximum of {MAX_BATCH_SIZE}",
        )

    try:
        images = []
        for url in request.image_urls:
            image = await fetch_image(url)
            images.append(image)

        inputs = processor(images=images, return_tensors="pt", padding=True).to(device)

        with torch.no_grad():
            image_features = model.get_image_features(**inputs)
            embeddings = image_features.cpu().numpy().tolist()

        return BatchEmbeddingResponse(embeddings=embeddings)
    except httpx.HTTPError as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch image: {str(e)}")
    except Exception as e:
        logger.exception("Error embedding images")
        raise HTTPException(status_code=500, detail=f"Batch embedding failed: {str(e)}")


@app.post("/embed-text", response_model=EmbeddingResponse)
async def embed_text(request: TextEmbedRequest):
    try:
        inputs = processor(text=request.text, return_tensors="pt", padding=True).to(device)

        with torch.no_grad():
            text_features = model.get_text_features(**inputs)
            embedding = text_features[0].cpu().numpy().tolist()

        return EmbeddingResponse(embedding=embedding)
    except Exception as e:
        logger.exception("Error embedding text")
        raise HTTPException(status_code=500, detail=f"Text embedding failed: {str(e)}")


@app.post("/embed-text/batch", response_model=BatchEmbeddingResponse)
async def embed_text_batch(request: TextEmbedBatchRequest):
    if len(request.texts) > MAX_BATCH_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"Batch size exceeds maximum of {MAX_BATCH_SIZE}",
        )

    try:
        inputs = processor(text=request.texts, return_tensors="pt", padding=True).to(device)

        with torch.no_grad():
            text_features = model.get_text_features(**inputs)
            embeddings = text_features.cpu().numpy().tolist()

        return BatchEmbeddingResponse(embeddings=embeddings)
    except Exception as e:
        logger.exception("Error embedding texts")
        raise HTTPException(status_code=500, detail=f"Batch text embedding failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8001"))
    uvicorn.run(app, host="0.0.0.0", port=port)
