# routers/auth.py

from fastapi import (
    APIRouter,
    Depends,
    Request,
    Response,
    HTTPException,
    status,
    Cookie,
)
from fastapi.security import OAuth2PasswordRequestForm
from queries.user_queries import UserQueries
from models.users import UserRequest, UserResponse
from queries.accounts import AccountRepo, AccountLogin
from utils.exceptions import UserDatabaseException
from utils.authentication import (
    try_get_jwt_user_data,
    hash_password,
    generate_jwt,
    verify_password,
)

router = APIRouter(tags=["Authentication"], prefix="/api/auth")


@router.post("/signup")
async def signup(
    new_user: UserRequest,
    request: Request,
    response: Response,
    queries: UserQueries = Depends(),
) -> UserResponse:
    new_user.username = new_user.username.lower()
    hashed_password = hash_password(new_user.password)

    try:
        user = queries.create_user(new_user, hashed_password)
    except UserDatabaseException as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    token = generate_jwt(user)
    user_out = UserResponse(**user.model_dump())

    secure = request.url.scheme == "https"
    response.set_cookie(
        key="fast_api_token",
        value=token,
        httponly=True,
        samesite="lax",
        secure=secure,
    )
    return user_out


@router.post("/signin")
async def signin(
    request: Request,
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    repo: AccountRepo = Depends(),
) -> dict:
    user = repo.get_single_user(form_data.username)
    if user and verify_password(form_data.password, user.password):
        token = generate_jwt(user)
        secure = request.url.scheme == "https"

        response.set_cookie(
            key="fast_api_token",
            value=token,
            httponly=True,
            samesite="lax",
            secure=secure,
        )

        return {"username": user.username, "token": token}
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )


@router.get("/authenticate")
async def authenticate(
    user: UserResponse = Depends(try_get_jwt_user_data),
    fast_api_token: str = Cookie(None),
) -> dict:
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Not logged in"
        )
    return {"id": user.id, "username": user.username, "token": fast_api_token}


@router.delete("/signout")
async def signout(
    request: Request,
    response: Response,
):
    """
    Signs the user out by deleting their JWT Cookie
    """
    # Secure cookies only if running on something besides localhost
    secure = True if request.headers.get("origin") == "localhost" else False

    # Delete the cookie
    response.delete_cookie(
        key="fast_api_token", httponly=True, samesite="lax", secure=secure
    )

    # There's no need to return anything in the response.
    # All that has to happen is the cookie header must come back
    # Which causes the browser to delete the cookie
    return {"message": "Successfully logged out"}
