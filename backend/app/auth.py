"""
Authentication helpers for lightweight token-based API protection.
"""

import os

from fastapi import Depends, HTTPException, Query, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

security = HTTPBearer(auto_error=False)


def expected_api_token() -> str:
    return os.getenv("API_TOKEN", "dev-token-change-me")


def require_api_token(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
) -> str:
    token = credentials.credentials if credentials else None

    if not token or token != expected_api_token():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API token",
        )

    return token


def require_ws_token(token: str | None = Query(default=None)) -> str:
    if not token or token != expected_api_token():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing WebSocket token",
        )

    return token
