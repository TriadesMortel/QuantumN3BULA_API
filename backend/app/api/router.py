"""Main API router."""

from fastapi import APIRouter

from app.api import endpoints

router = APIRouter()

router.include_router(endpoints.health_router, tags=["Health"])
router.include_router(endpoints.auth_router, prefix="/auth", tags=["Authentication"])
router.include_router(endpoints.tasks_router, prefix="/tasks", tags=["Tasks"])
router.include_router(endpoints.agents_router, prefix="/agents", tags=["Agents"])
router.include_router(endpoints.logs_router, prefix="/logs", tags=["Logs"])
