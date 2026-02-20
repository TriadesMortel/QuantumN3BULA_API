"""Tests for health endpoints."""


def test_ping(client):
    """Test ping endpoint returns pong."""
    response = client.get("/api/ping")
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "pong"
    assert "timestamp" in data


def test_status(client):
    """Test status endpoint returns system health."""
    response = client.get("/api/status")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ["online", "degraded"]
    assert "version" in data
    assert "uptime" in data
    assert "database_connected" in data
    assert "active_agents" in data
    assert "active_tasks" in data


def test_root(client):
    """Test root endpoint returns app info."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "name" in data
    assert "version" in data
    assert "docs" in data
