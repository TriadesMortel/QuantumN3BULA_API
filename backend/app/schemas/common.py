"""Common schemas for API responses."""

from datetime import datetime
from typing import Any

from pydantic import BaseModel


class PingResponse(BaseModel):
    """Schema for ping response."""

    message: str = "pong"
    timestamp: datetime


class StatusResponse(BaseModel):
    """Schema for system status response."""

    status: str
    version: str
    uptime_seconds: float
    database_connected: bool
    active_agents: int
    pending_tasks: int
    total_logs: int


class MessageResponse(BaseModel):
    """Schema for generic message response."""

    message: str
    data: dict[str, Any] | None = None
