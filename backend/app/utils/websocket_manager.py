"""WebSocket manager for live updates."""

import json
from typing import Any

from fastapi import WebSocket


class ConnectionManager:
    """Manages WebSocket connections for live updates."""

    def __init__(self):
        """Initialize the connection manager."""
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        """Accept a new WebSocket connection."""
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        """Remove a WebSocket connection."""
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def send_personal_message(self, message: dict[str, Any], websocket: WebSocket):
        """Send a message to a specific client."""
        await websocket.send_text(json.dumps(message))

    async def broadcast(self, message: dict[str, Any]):
        """Broadcast a message to all connected clients."""
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_text(json.dumps(message))
            except Exception:
                disconnected.append(connection)

        # Remove disconnected clients
        for conn in disconnected:
            self.disconnect(conn)


# Global connection manager instance
manager = ConnectionManager()
