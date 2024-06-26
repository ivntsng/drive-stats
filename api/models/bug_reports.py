from pydantic import BaseModel
from typing import Union
from datetime import date


class Error(BaseModel):
    message: Union[str, None] = None
    detail: str


class BugReportIn(BaseModel):
    bug_title: str
    bug_desc: str
    bug_behavior: str
    bug_rating: str


class BugReportOut(BaseModel):
    id: int
    bug_title: str
    bug_desc: str
    bug_behavior: str
    bug_rating: str
    created_date: date
    user_id: int
