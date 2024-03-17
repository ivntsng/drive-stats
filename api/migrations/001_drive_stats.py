steps = [
    [
        # Creating the vehicles table
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
        # Dropping the vehicles table
        """
        DROP TABLE vehicles;
        """,
    ],
    [
        # Creating the vehicle_stats table
        """
        CREATE TABLE vehicle_stats (
          id SERIAL PRIMARY KEY,
          vehicle_id INTEGER REFERENCES vehicles(id), -- This establishes the foreign key relationship
          last_oil_change_date VARCHAR,
          last_tire_rotation_date VARCHAR,
          last_air_filter_date VARCHAR,
          last_brake_fluid_date VARCHAR,
          last_coolant_reservoir_date VARCHAR,
          last_transmission_fluid_date VARCHAR,
          last_cabin_filter_date VARCHAR,
          last_wiper_blades_date VARCHAR,
          last_update_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """,
        # Dropping the vehicle_stats table
        """
        DROP TABLE vehicle_stats;
        """,
    ],
]
