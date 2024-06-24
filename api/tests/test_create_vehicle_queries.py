import sys
import os
from datetime import date, timedelta, datetime
import jwt

# Set environment variables directly in the script (not recommended for production)
os.environ["SECRET_KEY"] = "your_secret_key"

sys.path.insert(
    0, os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
)

from main import app
from fastapi.testclient import TestClient
from queries.vehicles import VehicleRepository, VehicleIn, VehicleOut
from routers.auth import (
    try_get_jwt_user_data,
)  # Import the actual dependency used in your application

client = TestClient(app)


class emptyVehicles:
    def get_all_vehicles(self):
        return []


class demoVehicle(VehicleRepository):
    def create(self, vehicle: VehicleIn) -> VehicleOut:
        vehicle_data = vehicle.model_dump()  # Updated line
        vehicle_data["id"] = 1  # Add an ID for the mock
        return VehicleOut(**vehicle_data)


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


def test_get_all_vehicles():
    app.dependency_overrides[VehicleRepository] = emptyVehicles
    app.dependency_overrides[try_get_jwt_user_data] = get_current_user_override
    token = create_access_token({"sub": "test_user"})
    response = client.get(
        "/vehicles", headers={"Authorization": f"Bearer {token}"}
    )
    app.dependency_overrides = {}
    assert response.status_code == 200
    assert response.json() == []


def test_create_vehicle():
    app.dependency_overrides[VehicleRepository] = demoVehicle
    app.dependency_overrides[try_get_jwt_user_data] = get_current_user_override
    token = create_access_token({"sub": "test_user"})
    vehicle_in = VehicleIn(
        vehicle_name="Test Vehicle",
        year=2020,
        make="Test Make",
        model="Test Model",
        vin="1234567890ABCDEFG",
        mileage=10000,
        about="Test About",
        user_id=1,
        created_date=date.today(),
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
        "id": response_json["id"],  # Use the actual id returned
        "vehicle_name": "Test Vehicle",
        "year": 2020,
        "make": "Test Make",
        "model": "Test Model",
        "vin": "1234567890ABCDEFG",
        "mileage": 10000,
        "about": "Test About",
        "user_id": 1,
        "created_date": date.today().isoformat(),
    }
    assert response_json == expected_response
