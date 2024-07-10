import warnings
import sys
import os
from datetime import timedelta, datetime, date
import jwt
import pytz
from fastapi.testclient import TestClient
from main import app
from queries.vehicles import VehicleIn, VehicleOut, VehicleRepository
from routers.auth import try_get_jwt_user_data
from jose import JWTError, jwt as jose_jwt
from jose.constants import ALGORITHMS
from dotenv import load_dotenv
from unittest.mock import patch

# Load environment variables from .env file
load_dotenv()

# Ensure the signing key is set correctly
SIGNING_KEY = os.environ.get("SIGNING_KEY")

print(f"SIGNING_KEY in test setup: {SIGNING_KEY}")

client = TestClient(app)


def create_access_token(
    data: dict, expires_delta: timedelta = timedelta(minutes=15)
):
    SECRET_KEY = os.getenv("SIGNING_KEY")
    ALGORITHM = os.getenv("algorithm", ALGORITHMS.HS256)
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    # Add the 'user' field in the payload
    to_encode.update({"user": {"username": "test_user", "id": 1}})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    print(f"Created token: {encoded_jwt}")
    return encoded_jwt


def decode_access_token(token: str):
    SECRET_KEY = os.getenv("SIGNING_KEY")
    try:
        payload = jose_jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[os.getenv("algorithm", ALGORITHMS.HS256)],
        )
        print(f"Decoded token payload in test: {payload}")
        return payload
    except JWTError as e:
        print(f"JWT decode error in test: {e}")
        return None


# Mock class to simulate the JWTUserData
class MockJWTUserData:
    def __init__(self, id, username):
        self.id = id
        self.username = username


# Mock function to simulate the authentication dependency
def get_current_user_override():
    return MockJWTUserData(id=1, username="test_user")


class MockVehicleRepository:
    def get_all_vehicles(self):
        return [
            VehicleOut(
                id=1,
                vehicle_name="Hello World Test",
                year=2020,
                make="Test Make",
                model="Test Model",
                vin="1234567890ABCDEFG",
                mileage=10000,
                about="Test About",
                user_id=1,
                created_date=date(2024, 6, 24),
            )
        ]

    def create_vehicle(self, vehicle_data: VehicleIn):
        return VehicleOut(
            id=1,
            vehicle_name=vehicle_data.vehicle_name,
            year=vehicle_data.year,
            make=vehicle_data.make,
            model=vehicle_data.model,
            vin=vehicle_data.vin,
            mileage=vehicle_data.mileage,
            about=vehicle_data.about,
            user_id=vehicle_data.user_id,
            created_date=vehicle_data.created_date,
        )

    def get_vehicles_by_user_id(self, user_id: int):
        return [
            VehicleOut(
                id=1,
                vehicle_name="Hello World Test",
                year=2020,
                make="Test Make",
                model="Test Model",
                vin="1234567890ABCDEFG",
                mileage=10000,
                about="Test About",
                user_id=user_id,
                created_date=date(2024, 6, 24),
            )
        ]


# Apply the overrides within each test case to ensure they are used
def test_get_all_vehicles():
    app.dependency_overrides[VehicleRepository] = MockVehicleRepository
    app.dependency_overrides[try_get_jwt_user_data] = get_current_user_override

    token = create_access_token({"sub": "test_user"})
    response = client.get(
        "/vehicles", headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json() == [
        {
            "id": 1,
            "vehicle_name": "Hello World Test",
            "year": 2020,
            "make": "Test Make",
            "model": "Test Model",
            "vin": "1234567890ABCDEFG",
            "mileage": 10000,
            "about": "Test About",
            "user_id": 1,
            "created_date": "2024-06-24",
        }
    ]

    app.dependency_overrides = {}


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
