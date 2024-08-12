from pydantic import BaseModel, ValidationError
from typing import Optional
from fastapi import HTTPException
from queries.pool import pool
from datetime import date
import pytz
from models.vehicle_maintenance import (
    Error,
    VehicleMaintenanceIn,
    VehicleMaintenanceOut,
)


class VehicleMaintenanceRepo(BaseModel):
    def result_to_dict(self, result):
        if result:
            utc_time = result[7]
            local_date = self.convert_to_pst_date(utc_time)
            return {
                "id": result[0],
                "vehicle_id": result[1],
                "maintenance_type": result[2],
                "mileage": result[3],
                "cost": result[4],
                "description": result[5],
                "service_date": result[6],
                "created_date": local_date,
            }
        else:
            return None

    def convert_to_pst_date(self, utc_time):
        utc = pytz.utc
        pst = pytz.timezone("America/Los_Angeles")
        utc_dt = utc.localize(utc_time)
        pst_dt = utc_dt.astimezone(pst)
        return pst_dt.date()

    def create_maintenance_log(
        self, maintenance: VehicleMaintenanceIn
    ) -> VehicleMaintenanceOut:
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    query = """
                        INSERT INTO vehicle_maintenance
                          (vehicle_id, maintenance_type, mileage, cost, description, service_date)
                        VALUES
                          (%s, %s, %s, %s, %s, %s)
                        RETURNING
                          id, vehicle_id, maintenance_type, mileage, cost, description, service_date, created_date
                    """
                    values = [
                        maintenance.vehicle_id,
                        maintenance.maintenance_type,
                        maintenance.mileage,
                        maintenance.cost,
                        maintenance.description,
                        maintenance.service_date,
                    ]

                    cur.execute(query, values)
                    result = cur.fetchone()
                    if result:
                        result_dict = self.result_to_dict(result)
                        return VehicleMaintenanceOut(**result_dict)
                    else:
                        return None
        except Exception as ex:
            print(f"Error creating vehicle maintenance: {ex}")
            raise HTTPException(
                status_code=500, detail="Failed to add vehicle maintenance"
            )
