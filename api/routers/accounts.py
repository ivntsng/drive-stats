# routers/accounts.py

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
    Response,
    Request,
)
from queries.accounts import (
    AccountOut,
    AccountRepo,
    CheckAccountOut,
    CheckEmail,
    UpdatePasswordIn,
)
from typing import Optional
from dotenv import load_dotenv
from utils.authentication import try_get_jwt_user_data

import os

# Load environment variables from .env file
load_dotenv()

router = APIRouter(tags=["Accounts"])
blacklisted_tokens = set()


class DuplicateAccountError(Exception):
    pass


# Get the API_HOST from environment variables
API_HOST = os.getenv("VITE_API_HOST", "").strip().lower().rstrip("/")


def verify_api_host(request: Request):
    host = request.headers.get("host", "").strip().lower().rstrip("/")
    expected_host = API_HOST
    if host != expected_host:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Access Forbidden"
        )


@router.get(
    "/users/{username}",
    response_model=Optional[AccountOut],
    dependencies=[Depends(verify_api_host), Depends(try_get_jwt_user_data)],
)
def get_single_user(
    username: str,
    response: Response,
    repo: AccountRepo = Depends(),
) -> AccountOut:
    user = repo.get_single_user(username)
    if user:
        return user
    else:
        raise HTTPException(status_code=500, detail="User does not exist!")


@router.get(
    "/check/users/{username}",
    response_model=Optional[CheckAccountOut],
    dependencies=[Depends(verify_api_host), Depends(try_get_jwt_user_data)],
)
def check_single_user(
    username: str,
    repo: AccountRepo = Depends(),
) -> CheckAccountOut:
    user = repo.check_single_user(username)
    if user:
        return user
    else:
        raise HTTPException(status_code=500, detail="User does not exist!")


@router.get(
    "/check/email/{email}",
    response_model=Optional[CheckEmail],
    dependencies=[Depends(verify_api_host), Depends(try_get_jwt_user_data)],
)
def check_user_email(
    email: str,
    repo: AccountRepo = Depends(),
) -> CheckEmail:
    current_email = repo.check_user_email(email)
    if current_email:
        return current_email
    else:
        raise HTTPException(status_code=500, detail="Email does not exist!")


@router.put(
    "/account/update-password",
    response_model=Optional[AccountOut],
    dependencies=[Depends(verify_api_host), Depends(try_get_jwt_user_data)],
)
async def update_password(
    update_password_data: UpdatePasswordIn,
    repo: AccountRepo = Depends(),
):
    updated_account = repo.update_user_password(
        username=update_password_data.username,
        old_password=update_password_data.old_password,
        new_password=update_password_data.new_password,
    )
    return updated_account


def is_token_blacklisted(token: str):
    return token in blacklisted_tokens


@router.post(
    "/logout",
    dependencies=[Depends(verify_api_host), Depends(try_get_jwt_user_data)],
)
async def user_logout(token: str):
    if is_token_blacklisted(token):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token already revoked",
        )
    else:
        blacklisted_tokens.add(token)
        return {"message": "Logout successful"}
