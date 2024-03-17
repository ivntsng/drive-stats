from fastapi import APIRouter, Depends, Response, HTTPException, status
from typing import Union, List
from queries.vehicle_stats import (
    VehicleStatIn,
    VehicleStatRepository,
    VehicleStatOut,
    Error,
)
from pydantic import ValidationError

tags_metadata = [
    {
        "name": "Vehicle Statistics",
        "description": "Endpoints related to vehicle statistics.",
    },
]

router = APIRouter(tags=["Vehicles Statistics"])


@router.post(
    "/vehicle_stats/{vehicle_id}", response_model=Union[VehicleStatOut, Error]
)
def create_vehicle_stat(
    vehicle: VehicleStatIn,
    response: Response,
    repo: VehicleStatRepository = Depends(),
):
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
    "/vehicle_stats/{vehicle_id}", response_model=Union[VehicleStatOut, Error]
)
async def get_vehicle_stat_by_id(
    response: Response,
    vehicle_id: int,
    vehicle_repo: VehicleStatRepository = Depends(),
) -> VehicleStatOut | None:
    try:
        vehicle_stat = vehicle_repo.get_vehicle_stats_by_vehicle_id(vehicle_id)
        return vehicle_stat
    except HTTPException as http_exc:
        if http_exc.status_code == 404:
            raise
        else:
            print(
                f"Failed to grab vehicle stat {vehicle_id}",
                http_exc.detail,
            )
            response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
            return None


@router.get(
    "/all_vehicle_stats/{vehicle_id}",
    response_model=List[VehicleStatOut] | None,
)
async def get_all_vehicles_stat_by_id(
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
