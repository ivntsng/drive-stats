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
from mangum import Mangum
import logging
import subprocess

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Try to load environment variables from different files
# First try production, then fall back to development if available
if os.path.exists(".env.production"):
    load_dotenv(".env.production")
elif os.path.exists(".env"):
    load_dotenv(".env")
elif os.path.exists("api/.env"):
    load_dotenv("api/.env")


class Settings(BaseSettings):
    openapi_url: str = ""


settings = Settings()

app = FastAPI(docs_url=None, redoc_url=None, openapi_url="/openapi.json")
# app = FastAPI()
handler = Mangum(app)

# Set allowed origins
origins = [
    "https://drivestatsapp.com",
    "https://www.drivestatsapp.com",
    "https://www.api.drivestatsapp.com",
    "https://localhost",
    "https://localhost:8000",
    "http://localhost:5173",
    "http://localhost:8000",
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


@app.get("/")
async def read_root():
    return {"message": "Welcome to DriveStats API"}


@app.get("/secure-endpoint")
@limiter.limit("5/minute")
async def secure_endpoint(
    request: Request,
):
    return {"message": "This is a rate-limited and secure endpoint"}


@app.get("/docs", include_in_schema=False)
@limiter.limit("10/minute")
async def get_swagger_documentation(request: Request):
    return get_swagger_ui_html(
        openapi_url="/openapi.json", title="DriveStats API Documentation"
    )


@app.get("/redoc", include_in_schema=False)
@limiter.limit("10/minute")
async def get_redoc_documentation(request: Request):
    return get_redoc_html(
        openapi_url="/openapi.json", title="DriveStats API Documentation"
    )


# Include your routers here
from routers import (
    vehicles,
    accounts,
    auth,
    bug_reports,
    newsletter,
    vehicle_maintenance,
)

app.include_router(vehicles.router)
app.include_router(accounts.router)
app.include_router(auth.router)
app.include_router(bug_reports.router)
app.include_router(newsletter.router)
app.include_router(vehicle_maintenance.router)

# After loading environment variables
db_url = os.getenv("DATABASE_URL")
logger.info(f"Database URL: {db_url}")

# Run Flyway migrations
try:
    logger.info("Running database migrations...")
    # Log the current directory for debugging
    current_dir = os.path.dirname(os.path.abspath(__file__))
    logger.info(f"Current directory: {current_dir}")

    # Check if migrations directory exists
    migrations_dir = os.path.join(current_dir, "migrations")
    if os.path.exists(migrations_dir):
        logger.info(f"Migrations directory found: {migrations_dir}")
        # List migration files
        migration_files = os.listdir(migrations_dir)
        logger.info(f"Migration files: {migration_files}")
    else:
        logger.error(f"Migrations directory not found: {migrations_dir}")

    # Run Flyway
    result = subprocess.run(
        ["flyway", "migrate", "-configFiles=flyway.conf"],
        cwd=current_dir,
        capture_output=True,
        text=True,
    )

    # Log detailed output
    logger.info(f"Flyway exit code: {result.returncode}")
    logger.info(f"Flyway stdout: {result.stdout}")

    if result.returncode == 0:
        logger.info("Migrations completed successfully")
    else:
        logger.error(f"Migration failed: {result.stderr}")
except Exception as e:
    logger.error(f"Error running migrations: {str(e)}")
