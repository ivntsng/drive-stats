import sys
import os

sys.path.insert(
    0, os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
)

from main import app
from fastapi.testclient import TestClient
from queries.vehicles import VehicleRepository

client = TestClient(app)


class emptyVehicles:
    def get_all_vehicles(self):
        return []


def test_get_all_vehicles():
    app.dependency_overrides[VehicleRepository] = emptyVehicles
    response = client.get("/vehicles")
    app.dependency_overrides = {}
    assert response.status_code == 200
    assert response.json() == []
