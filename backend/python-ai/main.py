# python-ai/main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import numpy as np
from typing import List, Optional
import logging
import time

# 設定日誌
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="侵國侵城 AI Embedding Service",
    description="文本向量化服務，專為 RAG 系統設計",
    version="1.0.0"
)

# 全域變數存儲模型
model = None

class EmbeddingRequest(BaseModel):
    text: str
    normalize: bool = True

class EmbeddingResponse(BaseModel):
    embedding: List[float]
    dimension: int
    model: str
    processing_time: float

class BatchEmbeddingRequest(BaseModel):
    texts: List[str]
    normalize: bool = True

class BatchEmbeddingResponse(BaseModel):
    embeddings: List[List[float]]
    dimension: int
    model: str
    count: int
    processing_time: float

@app.on_event("startup")
async def startup_event():
    """啟動時載入模型"""
    global model
    try:
        logger.info("🚀 載入 E5-Large-V2 嵌入模型...")
        model = SentenceTransformer('intfloat/e5-large-v2')
        logger.info("✅ 模型載入成功！")
    except Exception as e:
        logger.error(f"❌ 模型載入失敗: {e}")
        raise

@app.get("/")
async def root():
    return {
        "service": "侵國侵城 AI Embedding Service",
        "version": "1.0.0",
        "model": "intfloat/e5-large-v2",
        "endpoints": {
            "embed": "POST /embed - 單一文本向量化",
            "embed/batch": "POST /embed/batch - 批量文本向量化",
            "health": "GET /health - 健康檢查"
        }
    }

@app.post("/embed", response_model=EmbeddingResponse)
async def create_embedding(request: EmbeddingRequest):
    """生成單一文本向量"""
    if not model:
        raise HTTPException(status_code=500, detail="模型未載入")
    
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="文本內容不能為空")
    
    try:
        start_time = time.time()
        
        # 生成嵌入向量
        embedding = model.encode(
            request.text, 
            normalize_embeddings=request.normalize
        )
        
        processing_time = time.time() - start_time
        
        return EmbeddingResponse(
            embedding=embedding.tolist(),
            dimension=len(embedding),
            model="intfloat/e5-large-v2",
            processing_time=processing_time
        )
    except Exception as e:
        logger.error(f"❌ 向量生成失敗: {e}")
        raise HTTPException(status_code=500, detail=f"向量生成失敗: {str(e)}")

@app.post("/embed/batch", response_model=BatchEmbeddingResponse)
async def create_batch_embeddings(request: BatchEmbeddingRequest):
    """批量生成文本向量"""
    if not model:
        raise HTTPException(status_code=500, detail="模型未載入")
    
    if not request.texts or len(request.texts) == 0:
        raise HTTPException(status_code=400, detail="文本列表不能為空")
    
    # 限制批量大小
    if len(request.texts) > 100:
        raise HTTPException(status_code=400, detail="批量大小不能超過 100")
    
    try:
        start_time = time.time()
        
        # 批量生成嵌入向量
        embeddings = model.encode(
            request.texts, 
            normalize_embeddings=request.normalize,
            batch_size=32
        )
        
        processing_time = time.time() - start_time
        
        return BatchEmbeddingResponse(
            embeddings=[emb.tolist() for emb in embeddings],
            dimension=len(embeddings[0]) if len(embeddings) > 0 else 0,
            model="intfloat/e5-large-v2",
            count=len(embeddings),
            processing_time=processing_time
        )
    except Exception as e:
        logger.error(f"❌ 批量向量生成失敗: {e}")
        raise HTTPException(status_code=500, detail=f"批量向量生成失敗: {str(e)}")

@app.get("/health")
async def health_check():
    """健康檢查端點"""
    model_status = "loaded" if model is not None else "not_loaded"
    
    return {
        "status": "healthy" if model is not None else "unhealthy",
        "service": "侵國侵城 Embedding Service",
        "model": {
            "name": "intfloat/e5-large-v2",
            "status": model_status,
            "dimension": 1024
        },
        "system": {
            "cpu_count": "available",
            "memory": "sufficient"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
