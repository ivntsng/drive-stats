from pydantic import BaseModel, ValidationError, Field, validator
from queries.pool import pool
from fastapi import HTTPException
from typing import Optional


class AccountIn(BaseModel):
    username: str
    password: str
    email: str


class AccountOut(BaseModel):
    id: int
    username: str
    password: str
    email: str


class Error(BaseModel):
    message: str


class DuplicateAccountError(ValueError):
    pass


class AccountRepo:
    def result_to_dict(self, result):
        if result:
            return {
                "id": result[0],
                "username": result[1],
                "password": result[2],
                "email": result[3],
            }
        else:
            return None

    def create_user(
        self, account: AccountIn, hashed_password: str
    ) -> AccountOut:
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        INSERT INTO accounts
                        (username, password, email)
                        VALUES
                        (%s, %s, %s)
                        RETURNING
                        id, username, password, email
                        """,
                        [
                            account.username,
                            hashed_password,
                            account.email,
                        ],
                    )
                    result = cur.fetchone()
                    if result:
                        result_dict = self.result_to_dict(result)
                        return AccountOut(**result_dict)
                    else:
                        raise HTTPException(
                            status_code=500, detail="Failed to create account."
                        )
        except ValidationError as e:
            print(f"Validation error: {e}")
            print(f"Payload causing the error: {account}")
            raise HTTPException(
                status_code=422, detail=f"Validation error: {e}"
            )  # HTTP 422 Unprocessable Entity
        except Exception as ex:
            print(f"Error creating account: {ex}")
            raise HTTPException(
                status_code=500, detail="Failed to create account."
            )

    def get_single_user(self, username: str) -> Optional[AccountOut]:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT *
                    FROM accounts
                    WHERE username = %s
                    """,
                    [username],
                )
                record = cur.fetchone()
                if record:
                    return AccountOut(
                        id=record[0],
                        username=record[1],
                        password=record[2],
                        email=record[3],
                    )
                else:
                    return None
