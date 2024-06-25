"""
Pydantic Models for Users.
"""

from pydantic import BaseModel, EmailStr
from typing import Optional


class UserRequest(BaseModel):
    """
    Represents a the parameters needed to create a new user
    """

    username: str
    password: str
    email: Optional[EmailStr] = None


class UserResponse(BaseModel):
    """
    Represents a user, with the password not included
    """

    id: int
    username: str


class UserWithPw(BaseModel):
    """
    Represents a user with password included
    """

    id: int
    username: str
    password: str
