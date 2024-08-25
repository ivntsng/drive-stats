from fastapi import (
    APIRouter,
    Depends,
    Response,
    HTTPException,
    status,
    Request,
)
from typing import Union, List
from queries.bug_reports import BugReportIn, BugReportOut, BugQueries, Error
from pydantic import ValidationError
from utils.authentication import try_get_jwt_user_data
from models.jwt import JWTUserData
from config import oauth2_scheme
from main import limiter

tags_metadata = [
    {
        "name": "Bug Reports",
        "description": "Endpoints related to bug reports.",
    },
]

router = APIRouter(tags=["Bug Reports"])


@router.post(
    "/bug_report",
    response_model=Union[BugReportOut, Error],
    dependencies=[Depends(oauth2_scheme)],
)
@limiter.limit("3/minute")
def create_bug_report(
    request: Request,
    bug_report: BugReportIn,
    repo: BugQueries = Depends(),
    current_user: JWTUserData = Depends(try_get_jwt_user_data),
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    bug_report_data = bug_report.dict()
    bug_report_data["user_id"] = current_user.id

    try:
        created_bug_report = repo.create_bug_report(bug_report_data)
        if create_bug_report:
            return created_bug_report
        else:
            raise HTTPException(
                status_code=500, detail="Failed to create bug report."
            )
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
