"""Task schemas for API requests/responses."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

TASK_COMMAND_PATTERN = r"^[A-Za-z0-9_:]+$"
TASK_COMMAND_DESCRIPTION = "Safe task action identifier. Use letters, numbers, underscores, or colons only."


class TaskCreate(BaseModel):
    """Schema for creating a new task."""

    name: str
    command: str = Field(
        ...,
        min_length=1,
        max_length=64,
        pattern=TASK_COMMAND_PATTERN,
        description=TASK_COMMAND_DESCRIPTION,
    )
    agent_id: int | None = None


class TaskExecute(BaseModel):
    """Schema for executing a command."""

    command: str = Field(
        ...,
        min_length=1,
        max_length=64,
        pattern=TASK_COMMAND_PATTERN,
        description=TASK_COMMAND_DESCRIPTION,
    )
    agent_id: int | None = None


class TaskResponse(BaseModel):
    """Schema for task response."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    command: str
    status: str
    result: str | None = None
    error: str | None = None
    agent_id: int | None = None
    created_at: datetime
    started_at: datetime | None = None
    completed_at: datetime | None = None
