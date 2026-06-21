# API endpoints
from app.api.endpoints.agents import router as agents_router
from app.api.endpoints.auth import router as auth_router
from app.api.endpoints.health import router as health_router
from app.api.endpoints.logs import router as logs_router
from app.api.endpoints.tasks import router as tasks_router

__all__ = [
    "health_router",
    "auth_router",
    "tasks_router",
    "agents_router",
    "logs_router",
]
