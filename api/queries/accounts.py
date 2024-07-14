from pydantic import BaseModel, ValidationError
from queries.pool import pool
from fastapi import HTTPException
from typing import Optional
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AccountIn(BaseModel):
    username: str
    password: str
    email: str


class AccountOut(BaseModel):
    id: int
    username: str
    password: str
    email: str


class CheckAccountOut(BaseModel):
    username: str
    email: str


class CheckEmail(BaseModel):
    email: str


class AccountLogin(BaseModel):
    username: str
    password: str


class Error(BaseModel):
    message: str


class DuplicateAccountError(ValueError):
    pass


class UpdatePasswordIn(BaseModel):
    username: str
    old_password: str
    new_password: str


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
                    lowercase_username = account.username.lower()
                    lowercase_email = account.email.lower()
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
                            lowercase_username,
                            hashed_password,
                            lowercase_email,
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

    def check_single_user(self, username: str) -> Optional[CheckAccountOut]:
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
                    return CheckAccountOut(
                        username=record[1],
                        email=record[3],
                    )
                else:
                    return None

    def check_user_email(self, email: str) -> Optional[CheckEmail]:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT *
                    FROM accounts
                    WHERE email = %s
                    """,
                    [email],
                )
                record = cur.fetchone()
                if record:
                    return CheckEmail(
                        email=record[3],
                    )
                else:
                    return None

    def update_user_password(
        self, username: str, old_password: str, new_password: str
    ) -> Optional[AccountOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        SELECT id, password
                        FROM accounts
                        WHERE username = %s
                        """,
                        [username],
                    )
                    result = cur.fetchone()
                    if result:
                        user_id, current_hashed_password = result
                        if not pwd_context.verify(
                            old_password, current_hashed_password
                        ):
                            raise HTTPException(
                                status_code=403, detail="Invalid old password."
                            )
                        new_hashed_password = pwd_context.hash(new_password)
                        cur.execute(
                            """
                            UPDATE accounts
                            SET password = %s
                            WHERE id = %s
                            RETURNING id, username, password, email
                            """,
                            [new_hashed_password, user_id],
                        )
                        updated_record = cur.fetchone()
                        if updated_record:
                            return AccountOut(
                                id=updated_record[0],
                                username=updated_record[1],
                                password=updated_record[2],
                                email=updated_record[3],
                            )
                        else:
                            raise HTTPException(
                                status_code=500,
                                detail="Failed to update password.",
                            )
                    else:
                        raise HTTPException(
                            status_code=404, detail="User not found."
                        )
        except ValidationError as e:
            print(f"Validation error: {e}")
            raise HTTPException(
                status_code=422, detail=f"Validation error: {e}"
            )
        except Exception as e:
            print(f"Error updating password: {e}")
            raise HTTPException(
                status_code=500, detail="Failed to update password"
            )
