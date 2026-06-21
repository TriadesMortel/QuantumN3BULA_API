"""Test fixtures and configuration."""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.database import Base, get_db
from app.main import app

# Create test database
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    """Override database dependency for testing."""
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture
def client():
    """Create test client with test database."""
    Base.metadata.create_all(bind=engine)
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    Base.metadata.drop_all(bind=engine)
    app.dependency_overrides.clear()


@pytest.fixture
def authenticated_client(client):
    """Create authenticated test client."""
    # Register a user
    client.post(
        "/api/auth/register",
        json={
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpassword123",
        },
    )

    # Login and get token
    response = client.post(
        "/api/auth/token",
        data={"username": "testuser", "password": "testpassword123"},
    )
    token = response.json()["access_token"]

    # Add auth header to client
    client.headers["Authorization"] = f"Bearer {token}"
    return client
