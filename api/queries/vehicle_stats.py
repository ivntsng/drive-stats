from pydantic import BaseModel, Field, validator, ValidationError
from typing import Optional
from fastapi import HTTPException
from queries.pool import pool
from datetime import datetime, date


class Error(BaseModel):
    message: str


class VehicleStatIn(BaseModel):
    vehicle_id: int
    last_oil_change_date: Optional[str]
    last_tire_rotation_date: Optional[str]
    last_air_filter_date: Optional[str]
    last_brake_fluid_date: Optional[str]
    last_coolant_reservoir_date: Optional[str]
    last_transmission_fluid_date: Optional[str]
    last_cabin_filter_date: Optional[str]
    last_wiper_blades_date: Optional[str]


class VehicleStatOut(BaseModel):
    id: int
    vehicle_id: int
    last_oil_change_date: Optional[str]
    last_tire_rotation_date: Optional[str]
    last_air_filter_date: Optional[str]
    last_brake_fluid_date: Optional[str]
    last_coolant_reservoir_date: Optional[str]
    last_transmission_fluid_date: Optional[str]
    last_cabin_filter_date: Optional[str]
    last_wiper_blades_date: Optional[str]


class VehicleStatRepository:
    def result_to_dict(self, result):
        if result:
            return {
                "id": result[0],
                "vehicle_id": result[1],
                "last_oil_change_date": result[2],
                "last_tire_rotation_date": result[3],
                "last_air_filter_date": result[4],
                "last_brake_fluid_date": result[5],
                "last_coolant_reservoir_date": result[6],
                "last_transmission_fluid_date": result[7],
                "last_cabin_filter_date": result[8],
                "last_wiper_blades_date": result[9],
            }
        else:
            return None

    def create_vehicle_stat(self, vehicle: VehicleStatIn) -> VehicleStatOut:
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        INSERT INTO vehicle_stats
                          (vehicle_id,
                          last_oil_change_date,
                          last_tire_rotation_date,
                          last_air_filter_date,
                          last_brake_fluid_date,
                          last_coolant_reservoir_date,
                          last_transmission_fluid_date,
                          last_cabin_filter_date,
                          last_wiper_blades_date)
                        VALUES
                          (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                        RETURNING
                        id,
                        vehicle_id,
                        last_oil_change_date,
                        last_tire_rotation_date,
                        last_air_filter_date,
                        last_brake_fluid_date,
                        last_coolant_reservoir_date,
                        last_transmission_fluid_date,
                        last_cabin_filter_date,
                        last_wiper_blades_date
                        """,
                        [
                            vehicle.vehicle_id,
                            vehicle.last_oil_change_date,
                            vehicle.last_tire_rotation_date,
                            vehicle.last_air_filter_date,
                            vehicle.last_brake_fluid_date,
                            vehicle.last_coolant_reservoir_date,
                            vehicle.last_transmission_fluid_date,
                            vehicle.last_cabin_filter_date,
                            vehicle.last_wiper_blades_date,
                        ],
                    )
                    result = cur.fetchone()
                    if result:
                        result_dict = self.result_to_dict(result)
                        return VehicleStatOut(**result_dict)
                    else:
                        print("No result found")
                        return None
        except ValidationError as e:
            print(f"Validation error: {e}")
            print(f"Payload causing the error: {vehicle}")
            raise HTTPException(
                status_code=422, detail=f"Validation error: {e}"
            )  # HTTP 422 Unprocessable Entity
        except Exception as ex:
            print(f"Error creating vehicle stats: {ex}")
            raise HTTPException(
                status_code=500, detail="Failed to add vehicle stats"
            )

    def get_vehicle_stats_by_vehicle_id(
        self, vehicle_id: int
    ) -> Optional[VehicleStatOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        SELECT * FROM vehicle_stats
                        WHERE vehicle_id = %s
                        ORDER BY last_update_timestamp DESC
                        LIMIT 1
                        """,
                        (vehicle_id,),
                    )
                    result = cur.fetchone()
                    if result is None:
                        raise HTTPException(
                            status_code=404,
                            detail=f"Vehicle with ID {vehicle_id} does not exist.",
                        )
                    result_dict = self.result_to_dict(result)
                    return VehicleStatOut(**result_dict)
        except Exception as e:
            print(f"Exception occurred: {e}")
            raise HTTPException(
                status_code=500, detail="Internal Server Error"
            )

    def get_all_vehicle_stat_by_id(
        self, vehicle_id: int
    ) -> Optional[list[VehicleStatOut]]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        SELECT * FROM vehicle_stats
                        WHERE vehicle_id = %s
                        ORDER BY id DESC
                        """,
                        (vehicle_id,),
                    )
                    results = cur.fetchall()
                    vehicles = [
                        self.result_to_dict(result) for result in results
                    ]
                    return [VehicleStatOut(**vehicle) for vehicle in vehicles]
        except Exception:
            raise HTTPException(
                status_code=500, detail="Internal server error"
            )
