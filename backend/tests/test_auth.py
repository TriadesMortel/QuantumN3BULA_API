"""Tests for authentication endpoints."""


def test_register_user(client):
    """Test user registration."""
    response = client.post(
        "/api/auth/register",
        json={
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "password123",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "newuser"
    assert data["email"] == "newuser@example.com"
    assert "id" in data


def test_register_duplicate_username(client):
    """Test registration with duplicate username fails."""
    # First registration
    client.post(
        "/api/auth/register",
        json={
            "username": "duplicateuser",
            "email": "first@example.com",
            "password": "password123",
        },
    )

    # Duplicate registration
    response = client.post(
        "/api/auth/register",
        json={
            "username": "duplicateuser",
            "email": "second@example.com",
            "password": "password123",
        },
    )
    assert response.status_code == 400


def test_login_success(client):
    """Test successful login."""
    # Register user
    client.post(
        "/api/auth/register",
        json={
            "username": "loginuser",
            "email": "login@example.com",
            "password": "password123",
        },
    )

    # Login
    response = client.post(
        "/api/auth/token",
        data={"username": "loginuser", "password": "password123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_invalid_credentials(client):
    """Test login with invalid credentials fails."""
    response = client.post(
        "/api/auth/token",
        data={"username": "nonexistent", "password": "wrongpassword"},
    )
    assert response.status_code == 401


def test_get_current_user(authenticated_client):
    """Test getting current user info."""
    response = authenticated_client.get("/api/auth/me")
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "testuser"
    assert data["email"] == "test@example.com"
