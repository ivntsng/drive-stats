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
        "name": "Vehicle Modifications",
        "description": "Endpoints related to vehicle Modifications.",
    },
]

router = APIRouter(tags=["Vehicles Modifications"])
