from models.bug_reports import BugReportIn, BugReportOut, Error
import pytz
from typing import Optional, List, Union
from queries.pool import pool
from pydantic import ValidationError


class BugQueries:
    def result_to_dict(self, result):
        if result:
            utc_time = result[5]
            local_date = self.convert_to_pst_date(utc_time)
            return {
                "id": result[0],
                "bug_title": result[1],
                "bug_desc": result[2],
                "bug_behavior": result[3],
                "bug_rating": result[4],
                "created_date": local_date,
                "user_id": result[6],
            }
        else:
            return None

    def convert_to_pst_date(self, utc_time):
        utc = pytz.utc
        pst = pytz.timezone("America/Los_Angeles")
        utc_dt = utc.localize(utc_time)
        pst_dt = utc_dt.astimezone(pst)
        return pst_dt.date()

    def create_bug_report(
        self, bug_report_data: dict
    ) -> Optional[BugReportOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        INSERT INTO bug_report
                          (bug_title, bug_desc, bug_behavior, bug_rating, user_id)
                        VALUES
                          (%s, %s, %s, %s, %s)
                        RETURNING id, bug_title, bug_desc, bug_behavior, bug_rating, created_date, user_id;
                        """,
                        [
                            bug_report_data["bug_title"],
                            bug_report_data["bug_desc"],
                            bug_report_data["bug_behavior"],
                            bug_report_data["bug_rating"],
                            bug_report_data["user_id"],
                        ],
                    )
                    result = cur.fetchone()
                    if result:
                        result_dict = self.result_to_dict(result)
                        return BugReportOut(**result_dict)
                    else:
                        return None
        except ValidationError as e:
            print(f"Failed to create bug report due to: {e}")
