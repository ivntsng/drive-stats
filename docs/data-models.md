# Data Models

This document outlines the database schema for the Drive Stats application.

## Users

| name            | type   | unique | optional |
| --------------- | ------ | ------ | -------- |
| id              | int    | yes    | no       |
| username        | string | yes    | no       |
| hashed_password | string | no     | no       |
| email           | string | yes    | no       |
| picture         | string | no     | yes      |

## Vehicles

| name            | type    | unique | optional |
| --------------- | ------- | ------ | -------- |
| id              | int     | yes    | no       |
| make            | string  | no     | no       |
| model           | string  | no     | no       |
| year            | int     | no     | no       |
| trim            | string  | no     | yes      |
| color           | string  | no     | yes      |
| vin             | string  | yes    | yes      |
| license_plate   | string  | yes    | yes      |
| purchase_date   | date    | no     | yes      |
| purchase_price  | decimal | no     | yes      |
| current_mileage | int     | no     | no       |
| owner_id        | int     | no     | no       |

## Maintenance Records

| name             | type    | unique | optional |
| ---------------- | ------- | ------ | -------- |
| id               | int     | yes    | no       |
| vehicle_id       | int     | no     | no       |
| service_type     | string  | no     | no       |
| service_date     | date    | no     | no       |
| mileage          | int     | no     | no       |
| cost             | decimal | no     | yes      |
| description      | text    | no     | yes      |
| service_provider | string  | no     | yes      |

## Modifications

| name              | type    | unique | optional |
| ----------------- | ------- | ------ | -------- |
| id                | int     | yes    | no       |
| vehicle_id        | int     | no     | no       |
| mod_name          | string  | no     | no       |
| mod_type          | string  | no     | yes      |
| installation_date | date    | no     | yes      |
| cost              | decimal | no     | yes      |
| description       | text    | no     | yes      |
| installer         | string  | no     | yes      |
