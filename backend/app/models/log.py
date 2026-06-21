"""Log model for system logging."""

from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Integer, String, Text

from app.core.database import Base


class Log(Base):
    """Log model for system logging."""

    __tablename__ = "logs"

    id = Column(Integer, primary_key=True, index=True)
    level = Column(String(20), default="info")
    message = Column(Text, nullable=False)
    source = Column(String(100), nullable=True)
    task_id = Column(Integer, nullable=True)
    agent_id = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
