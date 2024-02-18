from pydantic import BaseModel, Field, validator, ValidationError
from datetime import datetime
from typing import Union, Optional
from fastapi import HTTPException

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

    def create_vehicle(self, vehicle: VehicleIn) -> VehicleOut:
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

    def get_vehicle_by_id(self, vehicle_id: int) -> Optional[VehicleOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        "SELECT * FROM vehicles WHERE id = %s", (vehicle_id,)
                    )
                    result = cur.fetchone()
                    if result is None:
                        raise HTTPException(
                            status_code=404,
                            detail=f"Vehicle ID {vehicle_id} doesn't exist.",
                        )
                    result_dict = self.result_to_dict(result)
                    return VehicleOut(**result_dict)
        except Exception:
            raise HTTPException(
                status_code=500, detail="Internal server error"
            )

    def get_all_vehicles(self) -> Optional[list[VehicleOut]]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute("SELECT * FROM vehicles")
                    results = cur.fetchall()
                    vehicles = [
                        self.result_to_dict(result) for result in results
                    ]
                    return [VehicleOut(**vehicle) for vehicle in vehicles]
        except Exception:
            raise HTTPException(
                status_code=500, detail="Internal server error"
            )

    def update_vehicle(
        self, vehicle_id: int, vehicle: VehicleIn
    ) -> Optional[VehicleOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        UPDATE vehicles
                        SET
                          vehicle_name = %s,
                          year = %s,
                          make = %s,
                          model = %s,
                          vin = %s,
                          mileage = %s
                        WHERE id = %s
                        RETURNING id, vehicle_name, year, make, model, vin, mileage;
                        """,
                        [
                            vehicle.vehicle_name,
                            vehicle.year,
                            vehicle.make,
                            vehicle.model,
                            vehicle.vin,
                            vehicle.mileage,
                            vehicle_id,
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
            print(f"Failed to update vehicle: {e}")
            return None

    def delete_vehicle(self, vehicle_id: int) -> Optional[VehicleOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        "DELETE FROM vehicles WHERE id = %s RETURNING *",
                        (vehicle_id,),
                    )
                    result = cur.fetchone()
                    if result:
                        result_dict = self.result_to_dict(result)
                        return VehicleOut(**result_dict)
                    else:
                        print("No result found")
                        return None
        except Exception:
            raise HTTPException(
                status_code=500, detail="Internal server error"
            )
