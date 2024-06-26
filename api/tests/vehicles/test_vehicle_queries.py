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
from queries.vehicles import VehicleRepository, VehicleIn, VehicleOut
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


# Mock function to simulate the authentication dependency
def get_current_user_override():
    return MockJWTUserData(id=1, username="test_user")


# Function to convert UTC to PST
def convert_to_pst_date(utc_time):
    utc = pytz.utc
    pst = pytz.timezone("America/Los_Angeles")
    utc_dt = utc.localize(utc_time)
    pst_dt = utc_dt.astimezone(pst)
    return pst_dt.date()


def test_get_all_vehicles():
    with patch.object(VehicleRepository, "get_all_vehicles", return_value=[]):
        app.dependency_overrides[
            try_get_jwt_user_data
        ] = get_current_user_override
        token = create_access_token({"sub": "test_user"})
        response = client.get(
            "/vehicles", headers={"Authorization": f"Bearer {token}"}
        )
        app.dependency_overrides = {}
        assert response.status_code == 200
        assert response.json() == []


def test_create_vehicle():
    test_date = datetime(2024, 6, 24)  # Fixed date for testing
    vehicle_out = VehicleOut(
        id=1,
        vehicle_name="Hello World Test",
        year=2020,
        make="Test Make",
        model="Test Model",
        vin="1234567890ABCDEFG",
        mileage=10000,
        about="Test About",
        user_id=1,
        created_date=test_date.date(),
    )

    with patch.object(
        VehicleRepository, "create_vehicle", return_value=vehicle_out
    ):
        app.dependency_overrides[
            try_get_jwt_user_data
        ] = get_current_user_override
        token = create_access_token({"sub": "test_user"})
        vehicle_in = VehicleIn(
            vehicle_name="Hello World Test",
            year=2020,
            make="Test Make",
            model="Test Model",
            vin="1234567890ABCDEFG",
            mileage=10000,
            about="Test About",
            user_id=1,
            created_date=test_date.date(),
        )
        response = client.post(
            "/vehicles",
            json=vehicle_in.model_dump(),
            headers={"Authorization": f"Bearer {token}"},
        )
        app.dependency_overrides = {}
        assert response.status_code == 200
        response_json = response.json()
        expected_response = {
            "id": 1,
            "vehicle_name": "Hello World Test",
            "year": 2020,
            "make": "Test Make",
            "model": "Test Model",
            "vin": "1234567890ABCDEFG",
            "mileage": 10000,
            "about": "Test About",
            "user_id": 1,
            "created_date": test_date.date().isoformat(),
        }
        assert response_json == expected_response
