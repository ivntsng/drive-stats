from fastapi import APIRouter, Depends, Response, HTTPException, status
from typing import Union, List
from queries.vehicles import VehicleIn, VehicleRepository, VehicleOut, Error
from pydantic import ValidationError

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
        created_vehicle = repo.create_vehicle(vehicle)
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


@router.get("/vehicles/{vehicle_id}", response_model=VehicleOut | None)
async def get_vehicle_by_id(
    response: Response,
    vehicle_id: int,
    vehicle_repo: VehicleRepository = Depends(),
) -> VehicleOut | None:
    try:
        vehicle = vehicle_repo.get_vehicle_by_id(vehicle_id)
        return vehicle
    except HTTPException as http_exc:
        if http_exc.status_code == 404:
            raise
        else:
            print(
                f"Failed to grab vehicle ID {vehicle_id} due to an error: ",
                http_exc.detail,
            )
            response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
            return None


@router.get("/vehicles", response_model=List[VehicleOut] | None)
async def get_all_vehicles(
    response: Response,
    vehicle_repo: VehicleRepository = Depends(),
) -> List[VehicleOut] | None:
    try:
        vehicles = vehicle_repo.get_all_vehicles()
        return vehicles
    except Exception as e:
        print(f"Failed to grab all vehicles due to an error: {e}")
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return None


@router.put("/vehicles/{vehicle_id}", response_model=Union[VehicleOut, Error])
async def update_vehicle(
    response: Response,
    vehicle_id: int,
    vehicle: VehicleIn,
    vehicle_repo: VehicleRepository = Depends(),
) -> Union[VehicleOut, Error]:
    try:
        updated_vehicle = vehicle_repo.update_vehicle(vehicle_id, vehicle)
        if updated_vehicle:
            return updated_vehicle
        else:
            raise HTTPException(
                status_code=500, detail="Failed to update vehicle"
            )
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"Failed to update vehicle ID {vehicle_id} due to an error: {e}")
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Error(detail="Internal server error")


@router.delete(
    "/vehicles/{vehicle_id}", response_model=Union[VehicleOut, Error]
)
async def delete_vehicle(
    response: Response,
    vehicle_id: int,
    vehicle_repo: VehicleRepository = Depends(),
) -> Union[VehicleOut, Error]:
    try:
        deleted_vehicle = vehicle_repo.delete_vehicle(vehicle_id)
        if deleted_vehicle:
            return deleted_vehicle
        else:
            raise HTTPException(
                status_code=500, detail="Failed to delete vehicle"
            )
    except Exception as e:
        print(f"Failed to delete vehicle ID {vehicle_id} due to an error: {e}")
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Error(detail="Internal server error")
