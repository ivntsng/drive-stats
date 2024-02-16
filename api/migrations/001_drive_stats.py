steps = [
    [
        """
        CREATE TABLE vehicles (
            id SERIAL NOT NULL PRIMARY KEY,
            vehicle_name VARCHAR(100) NOT NULL,
            year INTEGER NOT NULL,
            make VARCHAR(100) NOT NULL,
            model VARCHAR(100) NOT NULL,
            vin VARCHAR(100) NOT NULL,
            mileage VARCHAR(50) NOT NULL
        );
        """,
        """
        DROP TABLE vehicles;
        """,
    ],
]
