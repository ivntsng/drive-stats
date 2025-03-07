import os
import bcrypt
from calendar import timegm
from datetime import datetime, timedelta
from fastapi import Cookie, Header
from jose import JWTError, jwt
from jose.constants import ALGORITHMS
from typing import Annotated, Optional, Union
from models.jwt import JWTPayload, JWTUserData

from queries.user_queries import UserWithPw

# If you ever need to change the hashing algorithm, you can change it here
ALGORITHM = ALGORITHMS.HS256

# We pull this from the environment
SIGNING_KEY = os.environ.get("SIGNING_KEY")
if not SIGNING_KEY:
    raise ValueError("SIGNING_KEY environment variable not set")


async def decode_jwt(token: str) -> Optional[JWTPayload]:
    """
    Helper function to decode the JWT from a token string
    """
    try:
        payload = jwt.decode(token, SIGNING_KEY, algorithms=[ALGORITHM])
        return JWTPayload(**payload)
    except (JWTError, AttributeError) as e:
        print(f"JWT decoding error: {e}")
    return None


async def try_get_jwt_user_data(
    fast_api_token: Annotated[Optional[str], Cookie()] = None,
    authorization: Annotated[Optional[str], Header()] = None,
) -> Optional[JWTUserData]:
    token = fast_api_token
    if not token and authorization:
        if authorization.startswith("Bearer "):
            token = authorization[len("Bearer ") :]  # noqa: E203

    if not token:
        print("No JWT token found in cookies or Authorization header.")
        return None

    payload = await decode_jwt(token)
    if not payload:
        print("JWT token decoding failed or payload is empty.")
        return None
    return payload.user


def verify_password(plain_password, hashed_password) -> bool:
    """
    This verifies the user's password, by hashing the plain
    password and then comparing it to the hashed password
    from the database
    """
    return bcrypt.checkpw(
        plain_password.encode("utf-8"), hashed_password.encode("utf-8")
    )


def hash_password(plain_password) -> str:
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
        user=JWTUserData(username=user.username, id=user.id, email=user.email),
    )
    encoded_jwt = jwt.encode(
        jwt_data.model_dump(), SIGNING_KEY, algorithm=ALGORITHMS.HS256
    )
    return encoded_jwt
