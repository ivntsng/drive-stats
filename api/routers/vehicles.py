from fastapi import APIRouter, Depends, Response, HTTPException
from typing import Union
from queries.vehicles import VehicleIn, VehicleRepository, VehicleOut, Error

tags_metadata = [
    {
        "name": "vehicles",
        "description": "Endpoints related to vehicle management.",
    },
]

router = APIRouter(tags=["Vehicles"])


@router.post("/vehicles", response_model=Union[VehicleOut, Error])
def create_vehicle(
    vehicle: VehicleIn, response: Response, repo: VehicleRepository = Depends()
):
    try:
        created_vehicle = repo.create(vehicle)
        if created_vehicle:
            # Return 200 OK if the vehicle was created successfully
            return created_vehicle
        else:
            # If repo.create() returns None, it means an error occurred during creation
            raise HTTPException(
                status_code=500, detail="Failed to create vehicle"
            )
    except ValidationError as e:
        # If validation error occurs, return 400 Bad Request with details of the validation error
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        # For any other unexpected errors, return 500 Internal Server Error
        raise HTTPException(status_code=500, detail=str(e))
