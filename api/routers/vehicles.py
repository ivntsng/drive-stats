from fastapi import APIRouter
from queries.vehicles import VehicleIn

router = APIRouter()


@router.post("/vehicles")
def create_vehicle(vehicle: VehicleIn):
    print("vehicle", vehicle)
    return vehicle
