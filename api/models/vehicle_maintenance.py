from pydantic import BaseModel
from typing import Union
from datetime import date
import pytz


class Error(BaseModel):
    message: Union[str, None] = None
    detail: str


class VehicleMaintenanceIn(BaseModel):
    vehicle_id: int
    maintenance_type: str
    mileage: int
    cost: int
    description: str
    service_date: date


class VehicleMaintenanceOut(BaseModel):
    id: int
    vehicle_id: int
    maintenance_type: str
    mileage: int
    cost: int
    description: str
    service_date: date
    created_date: date
