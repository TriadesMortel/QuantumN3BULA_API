"""Log endpoints - /logs."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.log import Log
from app.models.user import User
from app.schemas.log import LogCreate, LogResponse

router = APIRouter()


@router.get("", response_model=list[LogResponse])
async def list_logs(
    skip: int = 0,
    limit: int = 100,
    level: str | None = None,
    source: str | None = None,
    db: Session = Depends(get_db),
):
    """List all logs with optional filtering."""
    query = db.query(Log)

    if level:
        query = query.filter(Log.level == level)
    if source:
        query = query.filter(Log.source == source)

    logs = query.order_by(Log.created_at.desc()).offset(skip).limit(limit).all()
    return logs


@router.get("/{log_id}", response_model=LogResponse)
async def get_log(
    log_id: int,
    db: Session = Depends(get_db),
):
    """Get a specific log entry by ID."""
    log = db.query(Log).filter(Log.id == log_id).first()
    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Log not found",
        )
    return log


@router.post("", response_model=LogResponse)
async def create_log(
    log_data: LogCreate,
    db: Session = Depends(get_db),
):
    """Create a new log entry."""
    log = Log(
        level=log_data.level,
        message=log_data.message,
        source=log_data.source,
        task_id=log_data.task_id,
        agent_id=log_data.agent_id,
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


@router.delete("/{log_id}")
async def delete_log(
    log_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a log entry (admin only)."""
    log = db.query(Log).filter(Log.id == log_id).first()
    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Log not found",
        )

    db.delete(log)
    db.commit()
    return {"message": "Log deleted successfully"}
