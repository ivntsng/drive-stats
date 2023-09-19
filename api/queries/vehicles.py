from pydantic import BaseModel
from typing import Optional


class VehicleIn(BaseModel):
    vehicle_name: str
    year: str
    make: str
    model: str
    vin: str
    mileage: str
