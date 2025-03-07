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
from utils.authentication import try_get_jwt_user_data
from config import oauth2_scheme
from models.jwt import JWTUserData
from main import limiter


router = APIRouter(tags=["Accounts"])
blacklisted_tokens = set()


class DuplicateAccountError(Exception):
    pass


@router.get(
    "/users/{username}",
    response_model=Optional[AccountOut],
)
@limiter.limit("10/minute")
def get_single_user(
    request: Request,
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
)
@limiter.limit("10/minute")
def check_single_user(
    request: Request,
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
)
@limiter.limit("10/minute")
def check_user_email(
    request: Request,
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
    dependencies=[
        Depends(try_get_jwt_user_data),
        Depends(oauth2_scheme),
    ],
)
@limiter.limit("10/minute")
async def update_password(
    request: Request,
    update_password_data: UpdatePasswordIn,
    current_user: JWTUserData = Depends(try_get_jwt_user_data),
    repo: AccountRepo = Depends(),
):
    # Ensure the username in the token matches the username in the request
    if update_password_data.username != current_user.username:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own password",
        )

    # Proceed to update the password
    updated_account = repo.update_user_password(
        username=update_password_data.username,
        current_password=update_password_data.current_password,
        new_password=update_password_data.new_password,
    )
    return updated_account


def is_token_blacklisted(token: str):
    return token in blacklisted_tokens


@router.post(
    "/logout",
    dependencies=[
        Depends(try_get_jwt_user_data),
        Depends(oauth2_scheme),
    ],
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
