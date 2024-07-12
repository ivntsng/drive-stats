from pydantic import BaseModel, ValidationError
from typing import Optional
from fastapi import HTTPException
from queries.pool import pool
from datetime import date
import pytz


class Error(BaseModel):
    message: str


class VehicleStatIn(BaseModel):
    vehicle_id: int
    last_oil_change: Optional[int]
    last_tire_rotation: Optional[int]
    last_tire_change: Optional[int]
    last_air_filter: Optional[int]
    last_brake_flush: Optional[int]
    last_brake_rotor: Optional[int]
    last_brake_pad: Optional[int]
    last_coolant_flush: Optional[int]
    last_transmission_fluid_flush: Optional[int]
    last_cabin_filter_change: Optional[int]
    last_wiper_blades_change: Optional[int]


class VehicleStatOut(BaseModel):
    id: int
    vehicle_id: int
    last_oil_change: Optional[int]
    last_tire_rotation: Optional[int]
    last_tire_change: Optional[int]
    last_air_filter: Optional[int]
    last_brake_flush: Optional[int]
    last_brake_rotor: Optional[int]
    last_brake_pad: Optional[int]
    last_coolant_flush: Optional[int]
    last_transmission_fluid_flush: Optional[int]
    last_cabin_filter_change: Optional[int]
    last_wiper_blades_change: Optional[int]
    last_update_timestamp: date


class VehicleStatRepository:
    def result_to_dict(self, result):
        if result:
            utc_time = result[13]  # Ensure this index is correct
            local_date = self.convert_to_pst_date(utc_time)
            return {
                "id": result[0],
                "vehicle_id": result[1],
                "last_oil_change": result[2],
                "last_tire_rotation": result[3],
                "last_tire_change": result[4],
                "last_air_filter": result[5],
                "last_brake_flush": result[6],
                "last_brake_rotor": result[7],
                "last_brake_pad": result[8],
                "last_coolant_flush": result[9],
                "last_transmission_fluid_flush": result[10],
                "last_cabin_filter_change": result[11],
                "last_wiper_blades_change": result[12],
                "last_update_timestamp": local_date,
            }
        else:
            return None

    def convert_to_pst_date(self, utc_time):
        utc = pytz.utc
        pst = pytz.timezone("America/Los_Angeles")
        utc_dt = utc.localize(utc_time)
        pst_dt = utc_dt.astimezone(pst)
        return pst_dt.date()

    def create_vehicle_stat(self, vehicle: VehicleStatIn) -> VehicleStatOut:
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    query = """
                        INSERT INTO vehicle_stats
                          (vehicle_id,
                          last_oil_change,
                          last_tire_rotation,
                          last_tire_change,
                          last_air_filter,
                          last_brake_flush,
                          last_brake_rotor,
                          last_brake_pad,
                          last_coolant_flush,
                          last_transmission_fluid_flush,
                          last_cabin_filter_change,
                          last_wiper_blades_change)
                        VALUES
                          (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                        RETURNING
                        id,
                        vehicle_id,
                        last_oil_change,
                        last_tire_rotation,
                        last_tire_change,
                        last_air_filter,
                        last_brake_flush,
                        last_brake_rotor,
                        last_brake_pad,
                        last_coolant_flush,
                        last_transmission_fluid_flush,
                        last_cabin_filter_change,
                        last_wiper_blades_change,
                        last_update_timestamp
                    """
                    values = [
                        vehicle.vehicle_id,
                        vehicle.last_oil_change,
                        vehicle.last_tire_rotation,
                        vehicle.last_tire_change,
                        vehicle.last_air_filter,
                        vehicle.last_brake_flush,
                        vehicle.last_brake_rotor,
                        vehicle.last_brake_pad,
                        vehicle.last_coolant_flush,
                        vehicle.last_transmission_fluid_flush,
                        vehicle.last_cabin_filter_change,
                        vehicle.last_wiper_blades_change,
                    ]

                    for i, value in enumerate(values):
                        print(f"Value {i}: {value} (Type: {type(value)})")

                    cur.execute(query, values)
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
                            detail=f"Vehicle maintenance log with Vehicle ID ({vehicle_id}) does not exist.",
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
