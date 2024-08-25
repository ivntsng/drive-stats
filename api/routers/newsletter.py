from fastapi import (
    APIRouter,
    Depends,
    Response,
    HTTPException,
    status,
    Request,
)
from models.newsletter import NewsletterEmailIn, NewsletterEmailOut, Error
from queries.newsletter import NewsLetterEmails
from typing import Union, List
from pydantic import ValidationError
from utils.authentication import try_get_jwt_user_data
from models.jwt import JWTUserData
from config import oauth2_scheme
from main import limiter

tags_metadata = [
    {
        "name": "Subscriber E-mail",
        "descripition": "Endpoint for storing subscriber e-mails.",
    }
]

router = APIRouter(tags=["Newsletter Subscriber List"], prefix="/api")


@router.post(
    "/subscribe-email",
    response_model=Union[NewsletterEmailOut, Error],
)
@limiter.limit("1/minute")
def store_subscriber_email(
    request: Request,
    subscriber_email: NewsletterEmailIn,
    repo: NewsLetterEmails = Depends(),
):
    try:
        stored_email = repo.store_subscriber_email(subscriber_email)
        if stored_email:
            return stored_email
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to store subscriber email.",
        )
    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=e.errors()
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )


# @router.get(
#     "/check-subscribe-email",
#     response_model=Union[NewsletterEmailOut, Error],
#     dependencies=[Depends(verify_api_host)],
# )
# @limiter.limit("2/minute")
# def check_subscriber_email(
#     request:Request,

# )
