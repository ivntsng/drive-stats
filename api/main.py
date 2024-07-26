from fastapi import FastAPI, Request, HTTPException, Depends, Security
from fastapi.security.api_key import APIKeyHeader
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from fastapi.openapi.docs import get_swagger_ui_html, get_redoc_html
from pydantic_settings import BaseSettings
import os

load_dotenv(".env.production")


class Settings(BaseSettings):
    openapi_url: str = ""


settings = Settings()

app = FastAPI(openapi_url=settings.openapi_url)

# Set allowed origins
origins = [
    "https://drivestatsapp.com",
    "https://www.drivestatsapp.com",
    "https://localhost",
    "https://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

API_KEY = os.getenv("API_KEY")
if not API_KEY:
    raise ValueError("API_KEY environment variable not set")

API_KEY_NAME = "access_token"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)


async def get_api_key(api_key_header: str = Security(api_key_header)):
    if api_key_header != API_KEY:
        raise HTTPException(
            status_code=403, detail="Could not validate credentials"
        )
    return api_key_header


@app.get("/secure-endpoint")
@limiter.limit("5/minute")
async def secure_endpoint(
    request: Request, api_key: str = Depends(get_api_key)
):
    return {"message": "This is a rate-limited and secure endpoint"}


@app.get("/docs", include_in_schema=False)
@limiter.limit("10/minute")
async def get_swagger_documentation(
    request: Request, api_key: str = Depends(get_api_key)
):
    return get_swagger_ui_html(openapi_url="/openapi.json", title="docs")


@app.get("/redoc", include_in_schema=False)
@limiter.limit("10/minute")
async def get_redoc_documentation(
    request: Request, api_key: str = Depends(get_api_key)
):
    return get_redoc_html(openapi_url="/openapi.json", title="docs")


# Include your routers here
from routers import vehicles, vehicle_stats, accounts, auth, bug_reports

app.include_router(vehicles.router)
app.include_router(vehicle_stats.router)
app.include_router(accounts.router)
app.include_router(auth.router)
app.include_router(bug_reports.router)
