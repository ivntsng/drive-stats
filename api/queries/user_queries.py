"""
Database Queries for Users
"""

import os
import psycopg
from psycopg_pool import ConnectionPool
from psycopg.rows import class_row
from typing import Optional
from models.users import UserWithPw
from utils.exceptions import UserDatabaseException
from pydantic import BaseModel, ValidationError
from fastapi import HTTPException


DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

pool = ConnectionPool(DATABASE_URL)


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


class UserQueries:
    """
    Class containing queries for the Users table

    Can be dependency injected into a route like so

    def my_route(userQueries: UserQueries = Depends()):
        # Here you can call any of the functions to query the DB
    """

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

    def get_by_username(self, username: str) -> Optional[UserWithPw]:
        """
        Gets a user from the database by username

        Returns None if the user isn't found
        """
        try:
            with pool.connection() as conn:
                with conn.cursor(row_factory=class_row(UserWithPw)) as cur:
                    cur.execute(
                        """
                            SELECT
                                *
                            FROM users
                            WHERE username = %s
                            """,
                        [username],
                    )
                    user = cur.fetchone()
                    if not user:
                        return None
        except psycopg.Error as e:
            print(e)
            raise UserDatabaseException(f"Error getting user {username}")
        return user

    def get_by_id(self, id: int) -> Optional[UserWithPw]:
        """
        Gets a user from the database by user id

        Returns None if the user isn't found
        """
        try:
            with pool.connection() as conn:
                with conn.cursor(row_factory=class_row(UserWithPw)) as cur:
                    cur.execute(
                        """
                            SELECT
                                *
                            FROM users
                            WHERE id = %s
                            """,
                        [id],
                    )
                    user = cur.fetchone()
                    if not user:
                        return None
        except psycopg.Error as e:
            print(e)
            raise UserDatabaseException(f"Error getting user with id {id}")

        return user

    def create_user(
        self, account_in: AccountIn, hashed_password: str
    ) -> AccountOut:
        """
        Creates a new user in the database

        Raises a UserInsertionException if creating the user fails
        """
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
                            account_in.username,
                            hashed_password,
                            account_in.email,
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
            print(f"Payload causing the error: {account_in}")
            raise HTTPException(
                status_code=422, detail=f"Validation error: {e}"
            )  # HTTP 422 Unprocessable Entity
        except Exception as ex:
            print(f"Error creating account: {ex}")
            raise HTTPException(
                status_code=500, detail="Failed to create account."
            )
