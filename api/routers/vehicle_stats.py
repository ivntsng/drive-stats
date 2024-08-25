from fastapi import (
    APIRouter,
    Depends,
    Response,
    HTTPException,
    status,
    Request,
)
from typing import Union, List
from queries.vehicle_stats import (
    VehicleStatIn,
    VehicleStatRepository,
    VehicleStatOut,
)
from pydantic import ValidationError, BaseModel
from config import oauth2_scheme
from models.jwt import JWTUserData
from utils.authentication import try_get_jwt_user_data
from main import limiter


tags_metadata = [
    {
        "name": "Vehicle Statistics",
        "description": "Endpoints related to vehicle statistics.",
    },
]

router = APIRouter(tags=["Vehicles Statistics"])


class Error(BaseModel):
    message: str


@router.post(
    "/vehicle_stats/{vehicle_id}",
    response_model=Union[VehicleStatOut, Error],
    dependencies=[Depends(oauth2_scheme)],
)
@limiter.limit("5/minute")
def create_vehicle_stat(
    request: Request,
    vehicle: VehicleStatIn,
    response: Response,
    repo: VehicleStatRepository = Depends(),
    current_user: JWTUserData = Depends(try_get_jwt_user_data),
):
    if not current_user:
        return HTTPException(status_code=401, detail="Unauthorized")
    try:
        create_vehicle_stat = repo.create_vehicle_stat(vehicle)
        if create_vehicle_stat:
            return create_vehicle_stat
        else:
            raise HTTPException(
                status_code=500, detail="Failed to add vehicle stat"
            )
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        # For any other unexpected errors, return 500 Internal Server Error
        raise HTTPException(status_code=500, detail=str(e))


@router.get(
    "/vehicle_stats/{vehicle_id}",
    response_model=Union[VehicleStatOut, Error],
    dependencies=[Depends(oauth2_scheme)],
)
@limiter.limit("20/minute")
async def get_vehicle_stat_by_id(
    request: Request,
    response: Response,
    vehicle_id: int,
    vehicle_repo: VehicleStatRepository = Depends(),
) -> Union[VehicleStatOut, Error]:
    try:
        vehicle_stat = vehicle_repo.get_vehicle_stats_by_vehicle_id(vehicle_id)
        if not vehicle_stat:
            response.status_code = status.HTTP_404_NOT_FOUND
            return Error(
                message="This vehicle doesn't have an existing maintenance log."
            )
        return vehicle_stat
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
    "/vehicle_stats/all/{vehicle_id}",
    response_model=List[VehicleStatOut] | None,
    dependencies=[Depends(oauth2_scheme)],
)
@limiter.limit("20/minute")
async def get_all_vehicles_stat_by_id(
    request: Request,
    response: Response,
    vehicle_id: int,
    vehicle_repo: VehicleStatRepository = Depends(),
) -> List[VehicleStatOut] | None:
    try:
        vehicle_stats = vehicle_repo.get_all_vehicle_stat_by_id(vehicle_id)
        return vehicle_stats
    except Exception as e:
        print(f"failed to grab all vehicle stats due to an error: {e}")
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return None
