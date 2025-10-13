# python-ai/main.py
from fastapi import FastAPI
from sentence_transformers import SentenceTransformer
import numpy as np
from typing import List

app = FastAPI(title="侵國侵城 AI Embedding Service")

# 載入嵌入模型（初始化時會下載）
model = SentenceTransformer('intfloat/e5-large-v2')

@app.post("/embed")
async def create_embedding(data: dict):
    """生成文本向量"""
    text = data.get("text", "")
    if not text:
        return {"error": "Text is required"}
    
    # 生成嵌入向量
    embedding = model.encode(text)
    
    return {
        "embedding": embedding.tolist(),
        "dimension": len(embedding),
        "model": "e5-large-v2"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Embedding Service",
        "model": "e5-large-v2"
    }
