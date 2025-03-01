from pydantic import BaseModel, ValidationError
from typing import Optional
from fastapi import HTTPException
from queries.pool import pool
from datetime import date
import pytz
from models.vehicle_maintenance import (
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

    def get_maintenance_log_by_vehicle_id(
        self, vehicle_id: int
    ) -> Optional[VehicleMaintenanceOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        SELECT * FROM vehicle_maintenance
                        WHERE vehicle_id = %s
                        ORDER BY service_date DESC
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
                    return VehicleMaintenanceOut(**result_dict)
        except Exception as e:
            print(f"Exception occurred: {e}")
            raise HTTPException(
                status_code=500, detail="Internal Server Error"
            )

    def get_all_maintenance_log_by_vehicle_id(
        self, vehicle_id: int
    ) -> Optional[list[VehicleMaintenanceOut]]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        SELECT * FROM vehicle_maintenance
                        WHERE vehicle_id = %s
                        ORDER by service_date DESC
                        """,
                        (vehicle_id,),
                    )
                    results = cur.fetchall()
                    vehicles = [
                        self.result_to_dict(result) for result in results
                    ]
                    return [
                        VehicleMaintenanceOut(**vehicle)
                        for vehicle in vehicles
                    ]
        except Exception:
            raise HTTPException(
                status_code=500, detail="Internal Server Error."
            )

    def get_maintenance_log_by_log_id(
        self, maintenance_log_id: int
    ) -> Optional[VehicleMaintenanceOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        SELECT * from vehicle_maintenance
                        WHERE id = %s
                        """,
                        (maintenance_log_id,),
                    )
                    result = cur.fetchone()
                    if result is None:
                        raise HTTPException(
                            status_code=404,
                            detail=f"Maintenance log with ID ({id}) does not exist.",
                        )
                    result_dict = self.result_to_dict(result)
                    return VehicleMaintenanceOut(**result_dict)
        except Exception as e:
            print(f"Exception occurred: {e}")
            raise HTTPException(
                status_code=500, detail="Internal Server Error"
            )

    def delete_maintenance_log_by_id(
        self, maintenance_log_id: int
    ) -> Optional[VehicleMaintenanceOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        "DELETE FROM vehicle_maintenance WHERE id = %s RETURNING *",
                        (maintenance_log_id,),
                    )
                    result = cur.fetchone()
                    if result:
                        result_dict = self.result_to_dict(result)
                        return VehicleMaintenanceOut(**result_dict)
                    else:
                        print(
                            f"Maintenance log ID {maintenance_log_id} does not exist."
                        )
                        return None  # Return None if the record does not exist
        except Exception as e:
            print(
                f"Error deleting maintenance log ID {maintenance_log_id}: {e}"
            )
            raise HTTPException(
                status_code=500, detail="Internal Server Error during deletion"
            )

    def update_maintenance_log_by_id(
        self, maintenance_log_id: int, log_id: VehicleMaintenanceIn
    ) -> Optional[VehicleMaintenanceOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        UPDATE vehicle_maintenance
                        SET
                          vehicle_id = %s,
                          maintenance_type = %s,
                          mileage = %s,
                          cost = %s,
                          description = %s,
                          service_date = %s
                        WHERE id = %s
                        RETURNING id, vehicle_id, maintenance_type, mileage, cost, description, service_date, created_date
                        """,
                        [
                            log_id.vehicle_id,
                            log_id.maintenance_type,
                            log_id.mileage,
                            log_id.cost,
                            log_id.description,
                            log_id.service_date,
                            maintenance_log_id,  # This is the value for the WHERE clause
                        ],
                    )
                    result = cur.fetchone()
                    if result is not None:
                        result_dict = self.result_to_dict(result)
                        return VehicleMaintenanceOut(**result_dict)
                    else:
                        print(
                            f"No maintenance log found with ID {maintenance_log_id}"
                        )
                        return None
        except ValidationError as e:
            print(f"Failed to update vehicle maintenance log: {e}")
            return None
        except Exception as e:
            print(
                f"Unexpected error while updating vehicle maintenance log: {e}"
            )
            return None
