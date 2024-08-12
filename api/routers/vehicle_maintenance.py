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
