from pydantic import BaseModel
from typing import Union
from datetime import date


class Error(BaseModel):
    message: Union[str, None] = None
    detail: str


class NewsletterEmailIn(BaseModel):
    subscriber_email: str


class NewsletterEmailOut(BaseModel):
    id: int
    subscriber_email: str
