DO $$
BEGIN
  IF NOT EXISTS(
    SELECT
    FROM
      pg_tables
    WHERE
      schemaname = 'public'
      AND tablename = 'vehicle_maintenance') THEN
  CREATE TABLE vehicle_stats(
    id serial PRIMARY KEY NOT NULL,
    vehicle_id integer NOT NULL REFERENCES vehicles(id ) ON DELETE CASCADE,
    maintenance_type varchar(255 ) NOT NULL,
    mileage int,
    COST NUMERIC(10, 2 ),
    description text,
    service_date date NOT NULL,
    last_update_timestamp timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
  );
END IF;
END
$$;
