from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import numpy as np
import hashlib
import time
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="侵國侵城 AI Embedding Service (Lite)",
    description="輕量版文本向量化服務",
    version="1.0.0-lite"
)

class EmbeddingRequest(BaseModel):
    text: str
    normalize: bool = True

class EmbeddingResponse(BaseModel):
    embedding: List[float]
    dimension: int
    model: str
    processing_time: float
    text_length: int

class MockEmbeddingModel:
    def __init__(self):
        self.model_name = "mock-e5-large-v2"
        self.dimension = 1024
        logger.info("✅ 模擬嵌入模型初始化完成")
    
    def encode(self, text: str, normalize_embeddings: bool = True) -> np.ndarray:
        # 使用文本哈希生成固定但唯一的向量
        hash_obj = hashlib.md5(text.encode('utf-8'))
        hash_bytes = hash_obj.digest()
        
        # 擴展到 1024 維
        vector = []
        for i in range(self.dimension):
            byte_idx = i % len(hash_bytes)
            vector.append((hash_bytes[byte_idx] / 255.0) - 0.5)  # 歸一化到 [-0.5, 0.5]
        
        vector = np.array(vector, dtype=np.float32)
        
        if normalize_embeddings:
            norm = np.linalg.norm(vector)
            if norm > 0:
                vector = vector / norm
                
        return vector

# 全域模型實例
model = MockEmbeddingModel()

@app.get("/")
async def root():
    return {
        "service": "侵國侵城 AI Embedding Service (Lite版本)",
        "version": "1.0.0-lite",
        "description": "輕量版向量化服務，用於開發測試",
        "model": {
            "name": "mock-e5-large-v2",
            "dimension": 1024,
            "status": "loaded",
            "type": "simulation"
        },
        "note": "這是模擬版本，生產環境請使用完整版",
        "endpoints": {
            "embed": "POST /embed - 文本向量化",
            "health": "GET /health - 健康檢查"
        }
    }

@app.post("/embed", response_model=EmbeddingResponse)
async def create_embedding(request: EmbeddingRequest):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="文本內容不能為空")
    
    try:
        start_time = time.time()
        
        embedding = model.encode(request.text, request.normalize)
        processing_time = time.time() - start_time
        
        logger.info(f"📝 處理文本: {request.text[:50]}...")
        
        return EmbeddingResponse(
            embedding=embedding.tolist(),
            dimension=len(embedding),
            model="mock-e5-large-v2",
            processing_time=processing_time,
            text_length=len(request.text)
        )
        
    except Exception as e:
        logger.error(f"❌ 向量生成失敗: {e}")
        raise HTTPException(status_code=500, detail=f"向量生成失敗: {str(e)}")

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "侵國侵城 AI Embedding Service (Lite)",
        "version": "1.0.0-lite",
        "model": {
            "name": "mock-e5-large-v2",
            "status": "loaded",
            "dimension": 1024,
            "type": "simulation"
        },
        "system": {
            "ready": True,
            "note": "輕量版服務，適用於開發測試"
        },
        "timestamp": time.time()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
