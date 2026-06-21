"""Quantum-N3BULA API - Main Application Entry Point."""

import logging

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from app.api import api_router
from app.core.config import settings
from app.core.database import Base, engine
from app.utils import LoggingMiddleware, manager

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("quantum_nebula")

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    description="Modular AI-ops platform API",
    version=settings.APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add logging middleware
app.add_middleware(LoggingMiddleware)

# Include API router
app.include_router(api_router, prefix="/api")


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "docs": "/docs",
    }


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for live updates from agents."""
    await manager.connect(websocket)
    logger.info("WebSocket client connected")

    try:
        while True:
            # Receive messages from client
            data = await websocket.receive_json()
            logger.info(f"WebSocket received: {data}")

            # Echo back with acknowledgment
            await manager.send_personal_message(
                {"event": "ack", "data": data},
                websocket,
            )
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        logger.info("WebSocket client disconnected")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
