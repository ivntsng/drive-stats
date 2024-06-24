from pydantic import BaseModel, ValidationError
from typing import Optional, List, Union
from fastapi import HTTPException
from queries.pool import pool
import pytz
from datetime import date


class Error(BaseModel):
    message: Union[str, None] = None
    detail: str


class VehicleIn(BaseModel):
    vehicle_name: str
    year: int
    make: str
    model: str
    vin: str
    mileage: int
    about: str


class VehicleOut(BaseModel):
    id: int
    vehicle_name: str
    year: int
    make: str
    model: str
    vin: str
    mileage: int
    about: str
    user_id: int
    created_date: date


class VehicleRepository:
    def result_to_dict(self, result):
        if result:
            utc_time = result[8]
            local_date = self.convert_to_pst_date(utc_time)
            return {
                "id": result[0],
                "vehicle_name": result[1],
                "year": result[2],
                "make": result[3],
                "model": result[4],
                "vin": result[5],
                "mileage": result[6],
                "about": result[7],
                "created_date": local_date,
                "user_id": result[9],
            }
        else:
            return None

    def convert_to_pst_date(self, utc_time):
        utc = pytz.utc
        pst = pytz.timezone("America/Los_Angeles")
        utc_dt = utc.localize(utc_time)
        pst_dt = utc_dt.astimezone(pst)
        return pst_dt.date()

    def create_vehicle(self, vehicle_data: dict) -> Optional[VehicleOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        INSERT INTO vehicles
                          (vehicle_name, year, make, model, vin, mileage, about, user_id)
                        VALUES
                          (%s, %s, %s, %s, %s, %s, %s, %s)
                        RETURNING id, vehicle_name, year, make, model, vin, mileage, about, created_date, user_id;
                        """,
                        [
                            vehicle_data["vehicle_name"],
                            vehicle_data["year"],
                            vehicle_data["make"],
                            vehicle_data["model"],
                            vehicle_data["vin"],
                            vehicle_data["mileage"],
                            vehicle_data["about"],
                            vehicle_data["user_id"],
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
                        return None
                    result_dict = self.result_to_dict(result)
                    return VehicleOut(**result_dict)
        except Exception as ex:
            print(f"Error getting vehicle ID {vehicle_id}: {ex}")
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

    def get_vehicles_by_user_id(self, user_id: int) -> List[VehicleOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        "SELECT * FROM vehicles WHERE user_id = %s", (user_id,)
                    )
                    results = cur.fetchall()
                    if not results:
                        raise HTTPException(
                            status_code=404,
                            detail=f"No vehicles found for USER ID {user_id}.",
                        )
                    return [
                        VehicleOut(**self.result_to_dict(result))
                        for result in results
                    ]
        except Exception as ex:
            print(f"Error fetching vehicles for user_id {user_id}: {ex}")
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
                        print(f"Vehicle ID {vehicle_id} does not exist.")
                        return None
        except Exception:
            print(f"Error deleting vehicle ID {vehicle_id}")
            return None
