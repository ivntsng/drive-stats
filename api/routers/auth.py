from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request,
    Response,
    status,
)
from fastapi.security import OAuth2PasswordRequestForm
from queries.user_queries import UserQueries
from models.users import UserRequest, UserResponse
from queries.accounts import AccountRepo
from config import oauth2_scheme
from main import limiter
from utils.exceptions import UserDatabaseException
from utils.authentication import (
    try_get_jwt_user_data,
    hash_password,
    generate_jwt,
    verify_password,
)

router = APIRouter(tags=["Authentication"], prefix="/api/auth")


@router.post("/signup")
@limiter.limit("10/minute")
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


@router.post("/token")
@limiter.limit("20/minute")
async def login_for_access_token(
    request: Request,
    form_data: OAuth2PasswordRequestForm = Depends(),
    repo: AccountRepo = Depends(),
):
    user = repo.get_single_user(form_data.username)
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = generate_jwt(user)
    return {"id": user.id, "access_token": token, "token_type": "bearer"}


@router.get("/authenticate")
@limiter.limit("30/minute")
async def authenticate(
    request: Request,
    token: str = Depends(oauth2_scheme),
    user: UserResponse = Depends(try_get_jwt_user_data),
) -> UserResponse:
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Not logged in"
        )
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "token": token,
    }


@router.delete("/signout")
@limiter.limit("10/minute")
async def signout(
    request: Request,
    response: Response,
):
    secure = request.url.scheme == "https"
    response.delete_cookie(
        key="fast_api_token", httponly=True, samesite="lax", secure=secure
    )
    return {"message": "Successfully logged out"}
