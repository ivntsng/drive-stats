steps = [
    [
        # Creating the accounts table with a check
        """
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'accounts') THEN
                CREATE TABLE accounts (
                    id SERIAL PRIMARY KEY NOT NULL,
                    username VARCHAR(20) NOT NULL UNIQUE,
                    password VARCHAR(100) NOT NULL,
                    email VARCHAR(100) NOT NULL UNIQUE
                );
            END IF;
        END $$;
        """,
        # Dropping the accounts table
        """
        DROP TABLE accounts;
        """,
    ],
    [
        # Creating the vehicles table with a check
        """
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'vehicles') THEN
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
            END IF;
        END $$;
        """,
        # Dropping the vehicles table
        """
        DROP TABLE vehicles;
        """,
    ],
    [
        # Creating the vehicle_maintenance table with a check
        """
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'vehicle_maintenance') THEN
                CREATE TABLE vehicle_maintenance (
                    id SERIAL PRIMARY KEY NOT NULL,
                    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
                    maintenance_type VARCHAR(255) NOT NULL,
                    mileage INT,
                    cost NUMERIC(10, 2),
                    description TEXT,
                    service_date DATE NOT NULL,
                    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
                );
            END IF;
        END $$;
        """,
        # Dropping the vehicle_maintenance table
        """
        DROP TABLE IF EXISTS vehicle_maintenance;
        """,
    ],
    [
        """
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'newsletter_subscribers') THEN
                CREATE TABLE newsletter_subscribers (
                    id SERIAL PRIMARY KEY NOT NULL,
                    subscriber_email VARCHAR(254) NOT NULL UNIQUE
                );
            END IF;
        END $$;
        """,
        # Dropping newsletter_subscribers.
        """
        DROP TABLE newsletter_subscribers;
        """,
    ],
]
