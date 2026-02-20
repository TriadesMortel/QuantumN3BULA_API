"""Application configuration."""

import os
import secrets
import warnings

from pydantic_settings import BaseSettings, SettingsConfigDict


def _get_secret_key() -> str:
    """Get secret key from environment or generate a warning."""
    key = os.getenv("SECRET_KEY")
    if not key:
        warnings.warn(
            "SECRET_KEY not set! Using a random key. "
            "Set SECRET_KEY environment variable in production.",
            UserWarning,
            stacklevel=2,
        )
        return secrets.token_urlsafe(32)
    return key


class Settings(BaseSettings):
    """Application settings."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Application
    APP_NAME: str = "Quantum-N3BULA"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"

    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", "sqlite:///./quantum_nebula.db"
    )

    # JWT Auth
    SECRET_KEY: str = _get_secret_key()
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://frontend:3000", "http://localhost:13000", "http://127.0.0.1:13000"]


settings = Settings()
