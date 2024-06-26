import warnings
import sys
import os
from datetime import timedelta, datetime
import jwt
import pytz
from fastapi.testclient import TestClient
from unittest.mock import patch

# Ignore DeprecationWarnings
warnings.filterwarnings("ignore", category=DeprecationWarning)

os.environ["SECRET_KEY"] = "your_secret_key"

# Adjust the path to include the directory where main.py is located
sys.path.insert(
    0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
)


from main import app
from queries.bug_reports import BugQueries, BugReportIn, BugReportOut
from routers.auth import try_get_jwt_user_data

client = TestClient(app)


def create_access_token(
    data: dict, expires_delta: timedelta = timedelta(minutes=15)
):
    SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key")
    ALGORITHM = "HS256"
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


# Mock class to simulate the JWTUserData
class MockJWTUserData:
    def __init__(self, id, username):
        self.id = id
        self.username = username


def get_current_user_override():
    return MockJWTUserData(id=1, username="test_user")


def convert_to_pst_date(utc_time):
    utc = pytz.utc
    pst = pytz.timezone("America/Los_Angeles")
    utc_dt = utc.localize(utc_time)
    pst_dt = utc_dt.astimezone(pst)
    return pst_dt.date()


def test_create_bug_report():
    test_date = datetime(2022, 3, 14)
    bug_report_out = BugReportOut(
        id=1,
        bug_title="Bug Report Testing",
        bug_desc="FooBar",
        bug_steps="Step1, step2, step3,",
        bug_behavior="Oh No!",
        expected_behavior="Oh Wow!",
        bug_rating="Important",
        created_date=test_date.date(),
        user_id=1,
    )
    with patch.object(
        BugQueries, "create_bug_report", return_value=bug_report_out
    ):
        app.dependency_overrides[
            try_get_jwt_user_data
        ] = get_current_user_override
        token = create_access_token({"sub": "test_user"})
        bug_report_in = BugReportIn(
            bug_title="Bug Report Testing",
            bug_desc="FooBar",
            bug_steps="Step1, step2, step3,",
            bug_behavior="Oh No!",
            expected_behavior="Oh Wow!",
            bug_rating="Important",
            created_date=test_date.date(),
            user_id=1,
        )
        response = client.post(
            "/bug_report",
            json=bug_report_in.model_dump(),
            headers={"Authorization": f"Bearer {token}"},
        )
        app.dependency_overrides = {}
        assert response.status_code == 200
        response_json = response.json()
        expected_response = {
            "id": 1,
            "bug_title": "Bug Report Testing",
            "bug_desc": "FooBar",
            "bug_steps": "Step1, step2, step3,",
            "bug_behavior": "Oh No!",
            "expected_behavior": "Oh Wow!",
            "bug_rating": "Important",
            "created_date": test_date.date(),
            "user_id": 1,
        }
        assert response_json == expected_response
