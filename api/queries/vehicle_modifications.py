from pydantic import BaseModel, ValidationError
from typing import Optional
from fastapi import HTTPException
from queries.pool import pool


