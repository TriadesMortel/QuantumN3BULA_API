"""Health check endpoints - /ping, /status."""

import time
from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.models.agent import Agent
from app.models.log import Log
from app.models.task import Task
from app.schemas.common import PingResponse, StatusResponse

router = APIRouter()

# Track application start time
APP_START_TIME = time.time()


@router.get("/ping", response_model=PingResponse)
async def ping():
    """Health check endpoint - returns pong."""
    return PingResponse(
        message="pong",
        timestamp=datetime.now(timezone.utc),
    )


@router.get("/health", response_model=StatusResponse)
async def health(db: Session = Depends(get_db)):
    """Alias for /status (compat)."""
    return await status(db)

@router.get("/status", response_model=StatusResponse)
async def status(db: Session = Depends(get_db)):
    """System status endpoint - returns system health and metrics."""
    try:
        # Check database connectivity
        db.execute(text("SELECT 1"))
        db_connected = True
    except Exception:
        db_connected = False

    # Get metrics
    active_agents = db.query(Agent).filter(Agent.is_active).count() if db_connected else 0
    pending_tasks = db.query(Task).filter(Task.status == "pending").count() if db_connected else 0
    total_logs = db.query(Log).count() if db_connected else 0

    return StatusResponse(
        status="online" if db_connected else "degraded",
        version=settings.APP_VERSION,
        uptime_seconds=time.time() - APP_START_TIME,
        database_connected=db_connected,
        active_agents=active_agents,
        pending_tasks=pending_tasks,
        total_logs=total_logs,
    )
