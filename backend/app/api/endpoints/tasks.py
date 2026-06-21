"""Task endpoints - /execute."""

import asyncio
from datetime import datetime, timezone

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import SessionLocal, get_db
from app.core.security import get_current_user
from app.models.log import Log
from app.models.task import Task, TaskStatus
from app.models.user import User
from app.schemas.task import TaskCreate, TaskExecute, TaskResponse
from app.utils.websocket_manager import manager

router = APIRouter()


async def _execute_task_async(task_id: int, command: str):
    """Execute task asynchronously (simulated)."""
    await asyncio.sleep(1)  # Simulate work

    # Create a new session for background task
    db = SessionLocal()
    try:
        # Update task status
        task = db.query(Task).filter(Task.id == task_id).first()
        if task:
            task.status = TaskStatus.COMPLETED.value
            task.result = f"Executed: {command}"
            task.completed_at = datetime.now(timezone.utc)
            db.commit()

            # Broadcast completion
            await manager.broadcast({
                "event": "task_completed",
                "task_id": task_id,
                "status": "completed",
                "result": task.result,
            })
    finally:
        db.close()


@router.post("/execute", response_model=TaskResponse)
async def execute_task(
    task_data: TaskExecute,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Execute a command and return task info."""
    # Create task
    task = Task(
        name=f"task-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}",
        command=task_data.command,
        agent_id=task_data.agent_id,
        status=TaskStatus.RUNNING.value,
        started_at=datetime.now(timezone.utc),
    )
    db.add(task)
    db.commit()
    db.refresh(task)

    # Log task creation
    log = Log(
        level="info",
        message=f"Task {task.id} started: {task_data.command}",
        source="task_executor",
        task_id=task.id,
    )
    db.add(log)
    db.commit()

    # Broadcast task started event
    await manager.broadcast({
        "event": "task_started",
        "task_id": task.id,
        "command": task.command,
    })

    # Schedule async task execution using background tasks
    background_tasks.add_task(_execute_task_async, task.id, task_data.command)

    return task


@router.get("", response_model=list[TaskResponse])
async def list_tasks(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    """List all tasks."""
    tasks = db.query(Task).offset(skip).limit(limit).all()
    return tasks


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: int,
    db: Session = Depends(get_db),
):
    """Get a specific task by ID."""
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
    return task


@router.post("", response_model=TaskResponse)
async def create_task(
    task_data: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new task."""
    task = Task(
        name=task_data.name,
        command=task_data.command,
        agent_id=task_data.agent_id,
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task
