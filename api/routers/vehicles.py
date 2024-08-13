from fastapi import (
    APIRouter,
    Depends,
    Response,
    HTTPException,
    status,
    Request,
)
from typing import Union, List
from queries.vehicles import VehicleIn, VehicleRepository, VehicleOut, Error
from fastapi.responses import JSONResponse
from pydantic import ValidationError
from utils.authentication import try_get_jwt_user_data
from models.jwt import JWTUserData
from config import verify_api_host, oauth2_scheme
from main import limiter


tags_metadata = [
    {
        "name": "vehicles",
        "description": "Endpoints related to vehicle management.",
    },
]
router = APIRouter(tags=["Vehicles"])


@router.post(
    "/vehicles",
    response_model=Union[VehicleOut, Error],
    dependencies=[Depends(verify_api_host), Depends(oauth2_scheme)],
)
@limiter.limit("5/minute")
def create_vehicle(
    request: Request,
    vehicle: VehicleIn,
    repo: VehicleRepository = Depends(),
    current_user: JWTUserData = Depends(try_get_jwt_user_data),
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    # Create a dictionary from the vehicle and add user_id
    vehicle_data = vehicle.dict()
    vehicle_data["user_id"] = current_user.id

    try:
        # Pass vehicle_data as a dictionary to the repository method
        created_vehicle = repo.create_vehicle(vehicle_data)
        if created_vehicle:
            return created_vehicle
        else:
            raise HTTPException(
                status_code=500, detail="Failed to create vehicle"
            )
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get(
    "/vehicles/{vehicle_id}",
    response_model=VehicleOut,
    dependencies=[Depends(verify_api_host), Depends(oauth2_scheme)],
)
@limiter.limit("20/minute")
async def get_vehicle_by_id(
    request: Request,
    response: Response,
    vehicle_id: int,
    vehicle_repo: VehicleRepository = Depends(),
    current_user: JWTUserData = Depends(try_get_jwt_user_data),
) -> VehicleOut:
    if not current_user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    vehicle = vehicle_repo.get_vehicle_by_id(vehicle_id)
    if vehicle is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "error": f"Vehicle with ID {vehicle_id} not found",
            },
        )
    return vehicle


@router.get(
    "/vehicles",
    response_model=Union[List[VehicleOut], Error],
    dependencies=[Depends(verify_api_host), Depends(oauth2_scheme)],
)
@limiter.limit("20/minute")
def list_vehicles(
    request: Request,
    repo: VehicleRepository = Depends(),
    current_user: JWTUserData = Depends(try_get_jwt_user_data),
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    try:
        vehicles = repo.get_vehicles_by_user_id(current_user.id)
        if not vehicles:  # Check if the vehicle list is empty
            return JSONResponse(
                status_code=200,
                content={"message": "No vehicles in the garage"},
            )
        return vehicles
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put(
    "/vehicles/update/{vehicle_id}",
    response_model=Union[VehicleOut, Error],
    dependencies=[Depends(verify_api_host), Depends(oauth2_scheme)],
)
@limiter.limit("5/minute")
async def update_vehicle(
    request: Request,
    response: Response,
    vehicle_id: int,
    vehicle: VehicleIn,
    vehicle_repo: VehicleRepository = Depends(),
    current_user: JWTUserData = Depends(try_get_jwt_user_data),
) -> Union[VehicleOut, Error]:
    if not current_user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    try:
        updated_vehicle = vehicle_repo.update_vehicle(vehicle_id, vehicle)
        if updated_vehicle:
            return updated_vehicle
        else:
            raise HTTPException(
                status_code=404, detail=f"Vehicle ID {vehicle_id} not found"
            )
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"Failed to update vehicle ID {vehicle_id} due to an error: {e}")
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Error(
            detail="Internal server error",
            message=f"Failed to update vehicle ID {vehicle_id} due to an error.",
        )


@router.delete(
    "/vehicles/delete/{vehicle_id}",
    response_model=Union[VehicleOut, Error],
    dependencies=[Depends(verify_api_host), Depends(oauth2_scheme)],
)
@limiter.limit("5/minute")
async def delete_vehicle(
    request: Request,
    response: Response,
    vehicle_id: int,
    vehicle_repo: VehicleRepository = Depends(),
    current_user: JWTUserData = Depends(try_get_jwt_user_data),
) -> Union[VehicleOut, Error]:
    if not current_user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    try:
        deleted_vehicle = vehicle_repo.delete_vehicle(vehicle_id)
        if deleted_vehicle:
            return deleted_vehicle
        else:
            return Error(
                detail=f"Vehicle with ID {vehicle_id} does not exist."
            )
    except Exception as e:
        print(f"Failed to delete vehicle ID {vehicle_id} due to an error: {e}")
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Error(
            detail="Internal server error",
            message=f"Vehicle ID {vehicle_id} does not exist.",
        )


@router.get(
    "/vehicles/user/{user_id}",
    response_model=List[
        VehicleOut
    ],  # Ensure this matches your expected output
    dependencies=[Depends(verify_api_host), Depends(oauth2_scheme)],
)
@limiter.limit("20/minute")
async def get_vehicles_by_user_id(
    request: Request,
    response: Response,
    user_id: int,
    vehicle_repo: VehicleRepository = Depends(),
    current_user: JWTUserData = Depends(try_get_jwt_user_data),
) -> List[VehicleOut]:
    if not current_user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    try:
        vehicles = vehicle_repo.get_vehicles_by_user_id(user_id)
        return vehicles
    except HTTPException as http_exc:
        print(
            f"Failed to grab USER ID {user_id} due to an HTTP error: {http_exc.detail}"
        )
        raise
    except Exception as exc:
        print(f"Server error occurred: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error",
        )
