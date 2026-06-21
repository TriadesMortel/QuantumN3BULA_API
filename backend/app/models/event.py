"""Event model for tracking system events."""

from datetime import datetime, timezone

from sqlalchemy import JSON, Column, DateTime, Integer, String

from app.core.database import Base


class Event(Base):
    """Event model for tracking system events."""

    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String(50), nullable=False, index=True)
    payload = Column(JSON, nullable=True)
    source = Column(String(100), nullable=True)
    task_id = Column(Integer, nullable=True)
    agent_id = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
