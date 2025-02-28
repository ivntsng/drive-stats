# Drive Stats API Design

This document outlines the API endpoints for the Drive Stats application.

## Authentication

### Token Authentication

-   **Method**: POST
-   **Path**: `/token`
-   **Description**: Obtain a JWT token for authentication
-   **Input**:
    ```json
    {
        "username": "string",
        "password": "string"
    }
    ```
-   **Output**:
    ```json
    {
        "access_token": "string",
        "token_type": "Bearer",
        "account": {
            "id": 0,
            "username": "string",
            "email": "string",
            "role": "string",
            "picture": "string"
        }
    }
    ```

## Users

### Create User

-   **Method**: POST
-   **Path**: `/users`
-   **Description**: Register a new user
-   **Input**:
    ```json
    {
        "username": "string",
        "email": "string",
        "password": "string",
        "role": "string",
        "picture": "string"
    }
    ```
-   **Output**:
    ```json
    {
        "access_token": "string",
        "token_type": "Bearer",
        "account": {
            "id": 0,
            "username": "string",
            "email": "string",
            "role": "string",
            "picture": "string"
        }
    }
    ```

### Get User

-   **Method**: GET
-   **Path**: `/users/{username}`
-   **Description**: Get user details
-   **Output**:
    ```json
    {
        "id": 0,
        "username": "string",
        "email": "string",
        "role": "string",
        "picture": "string"
    }
    ```

### Update User

-   **Method**: PUT
-   **Path**: `/users/{username}`
-   **Description**: Update user details
-   **Input**:
    ```json
    {
        "email": "string",
        "password": "string",
        "role": "string",
        "picture": "string"
    }
    ```
-   **Output**:
    ```json
    {
        "id": 0,
        "username": "string",
        "email": "string",
        "role": "string",
        "picture": "string"
    }
    ```

### Delete User

-   **Method**: DELETE
-   **Path**: `/users/{username}`
-   **Description**: Delete a user account
-   **Output**: 204 No Content

## Vehicles

### Create Vehicle

-   **Method**: POST
-   **Path**: `/vehicles`
-   **Description**: Add a new vehicle
-   **Input**:
    ```json
    {
        "make": "string",
        "model": "string",
        "year": 2023,
        "trim": "string",
        "color": "string",
        "vin": "string",
        "license_plate": "string",
        "purchase_date": "2023-07-25",
        "purchase_price": 25000.0,
        "current_mileage": 5000,
        "owner_id": 0
    }
    ```
-   **Output**:
    ```json
    {
        "id": 0,
        "make": "string",
        "model": "string",
        "year": 2023,
        "trim": "string",
        "color": "string",
        "vin": "string",
        "license_plate": "string",
        "purchase_date": "2023-07-25",
        "purchase_price": 25000.0,
        "current_mileage": 5000,
        "owner_id": 0
    }
    ```

### Get Vehicles

-   **Method**: GET
-   **Path**: `/vehicles`
-   **Description**: Get all vehicles for the authenticated user
-   **Output**:
    ```json
    [
        {
            "id": 0,
            "make": "string",
            "model": "string",
            "year": 2023,
            "trim": "string",
            "color": "string",
            "vin": "string",
            "license_plate": "string",
            "purchase_date": "2023-07-25",
            "purchase_price": 25000.0,
            "current_mileage": 5000,
            "owner_id": 0
        }
    ]
    ```

### Get Vehicle

-   **Method**: GET
-   **Path**: `/vehicles/{vehicle_id}`
-   **Description**: Get details for a specific vehicle
-   **Output**:
    ```json
    {
        "id": 0,
        "make": "string",
        "model": "string",
        "year": 2023,
        "trim": "string",
        "color": "string",
        "vin": "string",
        "license_plate": "string",
        "purchase_date": "2023-07-25",
        "purchase_price": 25000.0,
        "current_mileage": 5000,
        "owner_id": 0
    }
    ```

### Update Vehicle

-   **Method**: PUT
-   **Path**: `/vehicles/{vehicle_id}`
-   **Description**: Update vehicle details
-   **Input**:
    ```json
    {
        "make": "string",
        "model": "string",
        "year": 2023,
        "trim": "string",
        "color": "string",
        "vin": "string",
        "license_plate": "string",
        "purchase_date": "2023-07-25",
        "purchase_price": 25000.0,
        "current_mileage": 5000
    }
    ```
-   **Output**:
    ```json
    {
        "id": 0,
        "make": "string",
        "model": "string",
        "year": 2023,
        "trim": "string",
        "color": "string",
        "vin": "string",
        "license_plate": "string",
        "purchase_date": "2023-07-25",
        "purchase_price": 25000.0,
        "current_mileage": 5000,
        "owner_id": 0
    }
    ```

### Delete Vehicle

-   **Method**: DELETE
-   **Path**: `/vehicles/{vehicle_id}`
-   **Description**: Delete a vehicle
-   **Output**: 204 No Content

## Maintenance Records

### Create Maintenance Record

-   **Method**: POST
-   **Path**: `/vehicles/{vehicle_id}/maintenance`
-   **Description**: Add a maintenance record for a vehicle
-   **Input**:
    ```json
    {
        "service_type": "string",
        "service_date": "2023-07-25",
        "mileage": 5000,
        "cost": 150.0,
        "description": "string",
        "service_provider": "string"
    }
    ```
-   **Output**:
    ```json
    {
        "id": 0,
        "vehicle_id": 0,
        "service_type": "string",
        "service_date": "2023-07-25",
        "mileage": 5000,
        "cost": 150.0,
        "description": "string",
        "service_provider": "string"
    }
    ```

### Get Maintenance Records

-   **Method**: GET
-   **Path**: `/vehicles/{vehicle_id}/maintenance`
-   **Description**: Get all maintenance records for a vehicle
-   **Output**:
    ```json
    [
        {
            "id": 0,
            "vehicle_id": 0,
            "service_type": "string",
            "service_date": "2023-07-25",
            "mileage": 5000,
            "cost": 150.0,
            "description": "string",
            "service_provider": "string"
        }
    ]
    ```

### Get Maintenance Record

-   **Method**: GET
-   **Path**: `/vehicles/{vehicle_id}/maintenance/{record_id}`
-   **Description**: Get details for a specific maintenance record
-   **Output**:
    ```json
    {
        "id": 0,
        "vehicle_id": 0,
        "service_type": "string",
        "service_date": "2023-07-25",
        "mileage": 5000,
        "cost": 150.0,
        "description": "string",
        "service_provider": "string"
    }
    ```

### Update Maintenance Record

-   **Method**: PUT
-   **Path**: `/vehicles/{vehicle_id}/maintenance/{record_id}`
-   **Description**: Update a maintenance record
-   **Input**:
    ```json
    {
        "service_type": "string",
        "service_date": "2023-07-25",
        "mileage": 5000,
        "cost": 150.0,
        "description": "string",
        "service_provider": "string"
    }
    ```
-   **Output**:
    ```json
    {
        "id": 0,
        "vehicle_id": 0,
        "service_type": "string",
        "service_date": "2023-07-25",
        "mileage": 5000,
        "cost": 150.0,
        "description": "string",
        "service_provider": "string"
    }
    ```

### Delete Maintenance Record

-   **Method**: DELETE
-   **Path**: `/vehicles/{vehicle_id}/maintenance/{record_id}`
-   **Description**: Delete a maintenance record
-   **Output**: 204 No Content
