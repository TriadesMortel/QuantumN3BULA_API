"""Agent model for AI-ops agents."""

from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text

from app.core.database import Base


class Agent(Base):
    """Agent model for AI-ops agents."""

    __tablename__ = "agents"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(20), default="inactive")
    is_active = Column(Boolean, default=True)
    last_heartbeat = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
