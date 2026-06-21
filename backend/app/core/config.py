"""Application configuration."""

import os
import secrets
import warnings

from pydantic_settings import BaseSettings, SettingsConfigDict

_DEV_FALLBACK_SECRET: str = secrets.token_urlsafe(32)


def _is_debug_mode() -> bool:
    """Return whether local debug mode is enabled from environment."""
    return os.getenv("DEBUG", "true").strip().lower() in {"1", "true", "yes", "on"}


def _get_secret_key() -> str:
    """Get SECRET_KEY from environment; allow temporary fallback only in debug."""
    key = os.getenv("SECRET_KEY")
    if key:
        return key

    if _is_debug_mode():
        warnings.warn(
            "SECRET_KEY not set — using a temporary per-process key in DEBUG mode. "
            "All JWTs will be invalidated on restart. "
            "Set SECRET_KEY for a stable key.",
            UserWarning,
            stacklevel=2,
        )
        return _DEV_FALLBACK_SECRET

    raise RuntimeError("SECRET_KEY environment variable must be set when DEBUG is false.")


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
