"""Logging middleware for request/response logging."""

import logging
import time
import uuid
from typing import Callable

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger("quantum_nebula")


class LoggingMiddleware(BaseHTTPMiddleware):
    """Middleware for logging HTTP requests and responses."""

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """Process the request and log details."""
        start_time = time.time()
        request_id = str(uuid.uuid4())

        # Log request
        logger.info(
            f"[{request_id}] Request: {request.method} {request.url.path}"
        )

        # Process request
        response = await call_next(request)

        # Calculate duration
        duration = time.time() - start_time

        # Log response
        logger.info(
            f"[{request_id}] Response: {response.status_code} "
            f"Duration: {duration:.3f}s"
        )

        # Add custom headers
        response.headers["X-Request-ID"] = request_id
        response.headers["X-Process-Time"] = str(duration)

        return response
