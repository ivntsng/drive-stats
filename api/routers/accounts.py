from fastapi import APIRouter, Depends, HTTPException, status, Response
from queries.accounts import (
    AccountOut,
    AccountRepo,
    CheckAccountOut,
    CheckEmail,
)
from typing import Optional


router = APIRouter(tags=["Accounts"])
blacklisted_tokens = set()


class DuplicateAccountError(Exception):
    pass


# @router.post("/users/signup", response_model=AccountOut)
# async def user_signup(info: AccountIn, repo: AccountRepo = Depends()):
#     hashed_password_bytes = bcrypt.hashpw(
#         info.password.encode(), bcrypt.gensalt()
#     )  # Hashing the password using bcrypt
#     hashed_password_str = (
#         hashed_password_bytes.decode()
#     )  # Converting bytes to string
#     try:
#         result_dict = repo.create_user(info, hashed_password_str)
#         if result_dict:
#             return result_dict
#         else:
#             raise HTTPException(
#                 status_code=500, detail="Failed to create account."
#             )
#     except DuplicateAccountError:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Cannot create an account with those credentials",
#         )


@router.get("/users/{username}", response_model=Optional[AccountOut])
def get_single_user(
    username: str,
    response: Response,
    repo: AccountRepo = Depends(),
) -> AccountOut:
    user = repo.get_single_user(username)
    print(user)
    if user:
        return user
    else:
        raise HTTPException(status_code=500, detail="User does not exist!")


@router.get(
    "/check/users/{username}", response_model=Optional[CheckAccountOut]
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


@router.get("/check/email/{email}", response_model=Optional[CheckEmail])
def check_user_email(
    email: str,
    repo: AccountRepo = Depends(),
) -> CheckEmail:
    current_email = repo.check_user_email(email)
    if current_email:
        return current_email
    else:
        raise HTTPException(status_code=500, detail="Email does not exist!")


def is_token_blacklisted(token: str):
    return token in blacklisted_tokens


@router.post("/logout")
async def user_logout(token: str):
    if is_token_blacklisted(token):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token already revoked",
        )
    else:
        blacklisted_tokens.add(token)
        return {"message": "Logout successful"}
