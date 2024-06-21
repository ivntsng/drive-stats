steps = [
    [
        # Creating the accounts table
        """
        CREATE TABLE accounts (
          id SERIAL PRIMARY KEY NOT NULL,
          username VARCHAR(20) NOT NULL UNIQUE,
          password VARCHAR(100) NOT NULL,
          email VARCHAR(100) NOT NULL UNIQUE
        );
        """,
        # Dropping the accounts table
        """
        DROP TABLE accounts;
        """,
    ],
    [
        # Creating the vehicles table
        """
        CREATE TABLE vehicles (
            id SERIAL NOT NULL PRIMARY KEY,
            vehicle_name VARCHAR(100) NOT NULL,
            year INTEGER NOT NULL,
            make VARCHAR(100) NOT NULL,
            model VARCHAR(100) NOT NULL,
            vin VARCHAR(100),
            mileage VARCHAR(50),
            about VARCHAR(65),
            created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            user_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE
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
          vehicle_id INTEGER REFERENCES vehicles(id),
          last_oil_change INT,
          last_tire_rotation INT,
          last_tire_change INT,
          last_air_filter INT,
          last_brake_flush INT,
          last_brake_rotor INT,
          last_brake_pad INT,
          last_coolant_flush INT,
          last_transmission_fluid_flush INT,
          last_cabin_filter_change INT,
          last_wiper_blades_change INT,
          last_update_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """,
        # Dropping the vehicle_stats table
        """
        DROP TABLE vehicle_stats;
        """,
    ],
]
