"""
Helper functions for implementing authentication
"""

import os
import bcrypt
from calendar import timegm
from datetime import datetime, timedelta
from fastapi import Cookie, HTTPException, status, Header
from jose import JWTError, jwt
from jose.constants import ALGORITHMS
from typing import Optional
from models.jwt import JWTPayload, JWTUserData
from queries.user_queries import UserWithPw

# If you ever need to change the hashing algorithm, you can change it here
ALGORITHM = ALGORITHMS.HS256

# We pull this from the environment
SIGNING_KEY = os.environ.get("SIGNING_KEY")
if not SIGNING_KEY:
    raise ValueError("SIGNING_KEY environment variable not set")


async def decode_jwt(token: str) -> Optional[JWTPayload]:
    try:
        payload = jwt.decode(token, SIGNING_KEY, algorithms=["HS256"])
        return JWTPayload(**payload)
    except (JWTError, AttributeError) as e:
        print(e)
    return None


async def try_get_jwt_user_data(
    fast_api_token: Optional[str] = Cookie(None),
    authorization: Optional[str] = Header(None),
) -> JWTUserData:
    if not fast_api_token and not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    token = fast_api_token
    if authorization:
        scheme, _, param = authorization.partition(" ")
        if scheme.lower() != "bearer":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authorization scheme",
            )
        token = param

    payload = await decode_jwt(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )
    return payload.user


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    This verifies the user's password, by hashing the plain
    password and then comparing it to the hashed password
    from the database
    """
    return bcrypt.checkpw(
        plain_password.encode("utf-8"), hashed_password.encode("utf-8")
    )


def hash_password(plain_password: str) -> str:
    """
    Helper function that hashes a password
    """
    return bcrypt.hashpw(
        plain_password.encode("utf-8"), bcrypt.gensalt()
    ).decode()


def generate_jwt(user: UserWithPw) -> str:
    """
    Generates a new JWT token using the user's information

    We store the user as a JWTUserData converted to a dictionary
    in the payload of the JWT
    """
    exp = timegm((datetime.utcnow() + timedelta(hours=1)).utctimetuple())
    jwt_data = JWTPayload(
        exp=exp,
        sub=user.username,
        user=JWTUserData(username=user.username, id=user.id),
    )
    encoded_jwt = jwt.encode(jwt_data.dict(), SIGNING_KEY, algorithm=ALGORITHM)
    return encoded_jwt
