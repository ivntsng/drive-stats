from fastapi import (
    APIRouter,
    Depends,
    Response,
    HTTPException,
    status,
    Request,
)
from typing import Union, List
from queries.vehicle_maintenance import (
    VehicleMaintenanceIn,
    VehicleMaintenanceOut,
    VehicleMaintenanceRepo,
)
from queries.vehicles import VehicleRepository
from pydantic import ValidationError, BaseModel
from config import oauth2_scheme, verify_api_host
from models.jwt import JWTUserData
from utils.authentication import try_get_jwt_user_data
from main import limiter


tags_metadata = [
    {
        "name": "Vehicle Maintenance",
        "description": "Endpoints related to vehicle maintenance.",
    },
]

router = APIRouter(
    tags=["Vehicles Maintenance"], prefix="/api/vehicle-maintenance"
)


class Error(BaseModel):
    message: str


@router.post(
    "/create/{vehicle_id}",
    response_model=Union[VehicleMaintenanceOut, Error],
    dependencies=[Depends(verify_api_host), Depends(oauth2_scheme)],
)
@limiter.limit("5/minute")
def create_maintenance_log(
    request: Request,
    vehicle: VehicleMaintenanceIn,
    response: Response,
    repo: VehicleMaintenanceRepo = Depends(),
    current_user: JWTUserData = Depends(try_get_jwt_user_data),
):
    if not current_user:
        return HTTPException(status_code=401, detail="Unauthorized")
    try:
        create_maintenance_log = repo.create_maintenance_log(vehicle)
        if create_maintenance_log:
            return create_maintenance_log
        else:
            raise HTTPException(
                status_code=500, detail="Failed to add vehicle maintenance log"
            )
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get(
    "/maintenance-log/{vehicle_id}",
    response_model=Union[VehicleMaintenanceOut, Error],
    dependencies=[Depends(verify_api_host), Depends(oauth2_scheme)],
)
@limiter.limit("10/minute")
def retrieve_vehicle_maintenance_log_by_vehicle_id(
    request: Request,
    response: Response,
    vehicle_id: int,
    vehicle_repo: VehicleMaintenanceRepo = Depends(),
) -> Union[VehicleMaintenanceOut, Error]:
    try:
        vehicle_maintenance_log = (
            vehicle_repo.get_maintenance_log_by_vehicle_id(vehicle_id)
        )
        if not vehicle_maintenance_log:
            response.status_code = status.HTTP_404_NOT_FOUND
            return Error(
                message="This vehicle does not have an existing maintenance log."
            )
        return vehicle_maintenance_log
    except HTTPException as http_exc:
        if http_exc.status_code == 404:
            response.status_code = status.HTTP_404_NOT_FOUND
            return Error(message="This vehicle doesn't exist")
        else:
            print(
                f"Failed to grab vehicle stat {vehicle_id}",
                http_exc.detail,
            )
            response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
            return Error(message="Internal server error")
    except Exception as e:
        print(
            f"An unexpected error occurred while fetching vehicle stat {vehicle_id}",
            str(e),
        )
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Error(message="Internal server error")


@router.get(
    "/maintenance-logs/{vehicle_id}",
    response_model=List[VehicleMaintenanceOut] | None,
    dependencies=[Depends(verify_api_host), Depends(oauth2_scheme)],
)
@limiter.limit("20/minute")
def retrieve_all_vehicle_maintenance_logs_by_vehicle_id(
    request: Request,
    response: Response,
    vehicle_id: int,
    vehicle_repo: VehicleMaintenanceRepo = Depends(),
) -> List[VehicleMaintenanceOut] | None:
    try:
        vehicle_maintenance_log = (
            vehicle_repo.get_all_maintenance_log_by_vehicle_id(vehicle_id)
        )
        return vehicle_maintenance_log
    except Exception as e:
        print(
            f"Failed to grab vehicle ID {vehicle_id} maintenance log due to: {e}"
        )
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return None


@router.get(
    "/maintenance-log/detail/{maintenance_id}",
    response_model=Union[VehicleMaintenanceOut, Error],
    dependencies=[Depends(verify_api_host), Depends(oauth2_scheme)],
)
@limiter.limit("1000/minute")
def retrieve_maintenance_log_by_maintenance_id(
    request: Request,
    response: Response,
    maintenance_id: int,
    vehicle_repo: VehicleMaintenanceRepo = Depends(),
) -> Union[VehicleMaintenanceOut, Error]:
    try:
        maintenance_log_id = vehicle_repo.get_maintenance_log_by_log_id(
            maintenance_id
        )
        if not maintenance_log_id:
            response.status_code = status.HTTP_404_NOT_FOUND
            return Error(
                message="This vehicle does not have an existing maintenance log."
            )
        return maintenance_log_id
    except HTTPException as http_exc:
        if http_exc.status_code == 404:
            response.status_code = status.HTTP_404_NOT_FOUND
            return Error(message="This vehicle doesn't exist")
        else:
            print(
                f"Failed to grab vehicle stat {maintenance_id}",
                http_exc.detail,
            )
            response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
            return Error(message="Internal server error")
    except Exception as e:
        print(
            f"An unexpected error occurred while fetching vehicle stat {maintenance_id}",
            str(e),
        )
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Error(message="Internal server error")


@router.delete(
    "/maintenance-log/delete/{maintenance_id}",
    response_model=Union[VehicleMaintenanceOut, Error],
    dependencies=[Depends(verify_api_host), Depends(oauth2_scheme)],
)
async def delete_maintenance_log_id(
    request: Request,
    response: Response,
    maintenance_id: int,
    maintenance_repo: VehicleMaintenanceRepo = Depends(),
    vehicle_repo: VehicleRepository = Depends(),
    current_user: JWTUserData = Depends(try_get_jwt_user_data),
) -> Union[VehicleMaintenanceOut, Error]:
    if not current_user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    # Retrieve the maintenance log details
    existing_maintenance_log = maintenance_repo.get_maintenance_log_by_log_id(
        maintenance_id
    )

    if existing_maintenance_log is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Maintenance log with ID {maintenance_id} not found",
        )

    # Now retrieve the vehicle associated with this maintenance log
    vehicle = vehicle_repo.get_vehicle_by_id(
        existing_maintenance_log.vehicle_id
    )

    if vehicle is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Vehicle with ID {existing_maintenance_log.vehicle_id} not found",
        )

    # Check if the current user is the owner of the vehicle
    if vehicle.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to delete this maintenance log, please submit a bug report if this is an error.",
        )

    try:
        deleted_maintenance_log = (
            maintenance_repo.delete_maintenance_log_by_id(maintenance_id)
        )
        if deleted_maintenance_log:
            return deleted_maintenance_log
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Maintenance log with ID {maintenance_id} does not exist.",
            )
    except Exception as e:
        print(
            f"Failed to delete maintenance log ID {maintenance_id} due to an error: {e}"
        )
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Error(
            message="Internal server error",
            detail=f"Failed to delete maintenance log ID {maintenance_id}.",
        )


@router.put(
    "/maintenance-log/update/{maintenance_id}",
    response_model=Union[VehicleMaintenanceOut, Error],
    dependencies=[Depends(verify_api_host), Depends(oauth2_scheme)],
)
@limiter.limit("1000/minute")
async def update_maintenance_log(
    request: Request,
    response: Response,
    maintenance_log_id: int,
    maintenance_log: VehicleMaintenanceIn,
    maintenance_repo: VehicleMaintenanceRepo = Depends(),
    vehicle_repo: VehicleRepository = Depends(),
    current_user: JWTUserData = Depends(try_get_jwt_user_data),
) -> Union[VehicleMaintenanceOut, Error]:
    if not current_user:
        raise HTTPException(status_code=401, detail="Unauthorized")

        # Retrieve the maintenance log details
    existing_maintenance_log = maintenance_repo.get_maintenance_log_by_log_id(
        maintenance_log_id
    )

    if existing_maintenance_log is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Maintenance log with ID {maintenance_log_id} not found",
        )

    # Now retrieve the vehicle associated with this maintenance log
    vehicle = vehicle_repo.get_vehicle_by_id(
        existing_maintenance_log.vehicle_id
    )

    if vehicle is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Vehicle with ID {existing_maintenance_log.vehicle_id} not found",
        )

    # Check if the current user is the owner of the vehicle
    if vehicle.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to edit this maintenance log, please submit a bug report if this is an error.",
        )

    try:
        current_maintenance_log = (
            maintenance_repo.update_maintenance_log_by_id(
                maintenance_log_id, maintenance_log
            )
        )
        if current_maintenance_log:
            return current_maintenance_log
        else:
            raise HTTPException(
                status_code=404,
                detail=f"Maintenance Log ID {maintenance_log_id} not found.",
            )
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(
            f"Failed to update vehicle ID {maintenance_log_id} due to an error: {e}"
        )
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Error(
            detail="Internal server error",
            message=f"Failed to update vehicle ID {maintenance_log_id} due to an error.",
        )
