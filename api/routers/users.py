from fastapi import (
    Depends,
    APIRouter,
)
from typing import List
from queries.users import UserOut, UserRepository

router = APIRouter()


@router.get("/users", response_model=List[UserOut])
async def get_users(users: UserRepository = Depends()):
    return users.get_all()
