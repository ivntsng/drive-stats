from fastapi import Request, HTTPException, status
import os
from dotenv import load_dotenv
from fastapi.security import OAuth2PasswordBearer

# Load environment variables from .env file
load_dotenv()

# Get the API_HOST from environment variables
API_HOST = os.getenv("VITE_API_HOST", "").strip().lower().rstrip("/")

# Define oauth2_scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")
