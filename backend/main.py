import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from config import settings

from api import router as api_router
from core.engine_service import EngineService


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[STARTUP] Creating EngineService...")
    engine_service = EngineService()
    app.state.engine_service = engine_service
    print("[STARTUP] Initializing...")
    await engine_service.initialize()
    print("[STARTUP] Ready")
    yield


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Next-generation Intelligent Real-time Intelligent Knowledge-based Surveillance & Health Framework",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")


@app.get("/")
async def root():
    return {
        "service": settings.app_name,
        "version": settings.app_version,
        "status": "operational",
    }


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
    )
