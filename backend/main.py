from fastapi import FastAPI
from app.core.database import engine, Base
from app.api import dashboard, documents

# 데이터베이스 테이블 생성
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Corporate Loan API", version="1.0.0")

# 라우터 등록
app.include_router(dashboard.router)
app.include_router(documents.router)

@app.get("/")
def read_root():
    return {"message": "Corporate Loan API", "version": "1.0.0"}