from pydantic import BaseModel, Field, validator, ValidationError
from datetime import datetime
from typing import Union

# Assuming 'pool' is correctly defined elsewhere in your code.
from queries.pool import pool


class Error(BaseModel):
    message: str


class VehicleIn(BaseModel):
    vehicle_name: str
    year: int
    make: str
    model: str
    vin: str
    mileage: str


class VehicleOut(BaseModel):
    id: int
    vehicle_name: str
    year: int
    make: str
    model: str
    vin: str
    mileage: str


class VehicleRepository:
    def result_to_dict(self, result):
        if result:
            return {
                "id": result[0],
                "vehicle_name": result[1],
                "year": result[2],
                "make": result[3],
                "model": result[4],
                "vin": result[5],
                "mileage": result[6],
            }
        else:
            return None

    def create(self, vehicle: VehicleIn) -> VehicleOut:
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        INSERT INTO vehicles
                          (vehicle_name, year, make, model, vin, mileage)
                        VALUES
                          (%s, %s, %s, %s, %s, %s)
                        RETURNING id, vehicle_name, year, make, model, vin, mileage;
                        """,
                        [
                            vehicle.vehicle_name,
                            vehicle.year,
                            vehicle.make,
                            vehicle.model,
                            vehicle.vin,
                            vehicle.mileage,
                        ],
                    )
                    result = cur.fetchone()
                    if result:
                        result_dict = self.result_to_dict(result)
                        return VehicleOut(**result_dict)
                    else:
                        print("No result found")
                        return None
        except ValidationError as e:
            print(f"Failed to create vehicle: {e}")
            return None
