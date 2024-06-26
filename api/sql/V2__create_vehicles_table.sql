DO $$
BEGIN
  IF NOT EXISTS(
    SELECT
    FROM
      pg_tables
    WHERE
      schemaname = 'public'
      AND tablename = 'vehicles') THEN
  CREATE TABLE vehicles(
    id serial NOT NULL PRIMARY KEY,
    vehicle_name varchar(100 ) NOT NULL,
    year integer NOT NULL,
    make varchar(100 ) NOT NULL,
    model varchar(100 ) NOT NULL,
    vin varchar(100 ),
    mileage varchar(50 ),
    about varchar(65 ),
    created_date timestamp DEFAULT CURRENT_TIMESTAMP,
    user_id integer NOT NULL REFERENCES accounts(id ) ON DELETE CASCADE
  );
END IF;
END
$$;
