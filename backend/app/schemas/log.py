"""Log schemas for API requests/responses."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class LogCreate(BaseModel):
    """Schema for creating a new log entry."""

    level: str = "info"
    message: str
    source: str | None = None
    task_id: int | None = None
    agent_id: int | None = None


class LogResponse(BaseModel):
    """Schema for log response."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    level: str
    message: str
    source: str | None = None
    task_id: int | None = None
    agent_id: int | None = None
    created_at: datetime
