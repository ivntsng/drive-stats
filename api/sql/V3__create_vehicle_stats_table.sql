DO $$
BEGIN
  IF NOT EXISTS(
    SELECT
    FROM
      pg_tables
    WHERE
      schemaname = 'public'
      AND tablename = 'vehicle_stats') THEN
  CREATE TABLE vehicle_stats(
    id serial PRIMARY KEY,
    vehicle_id integer REFERENCES vehicles(id ) ON DELETE CASCADE,
    last_oil_change int,
    last_tire_rotation int,
    last_tire_change int,
    last_air_filter int,
    last_brake_flush int,
    last_brake_rotor int,
    last_brake_pad int,
    last_coolant_flush int,
    last_transmission_fluid_flush int,
    last_cabin_filter_change int,
    last_wiper_blades_change int,
    last_update_timestamp timestamp DEFAULT CURRENT_TIMESTAMP
  );
END IF;
END
$$;
