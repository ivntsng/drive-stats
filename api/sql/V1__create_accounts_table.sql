DO $$
BEGIN
  IF NOT EXISTS(
    SELECT
    FROM
      pg_tables
    WHERE
      schemaname = 'public'
      AND tablename = 'accounts') THEN
  CREATE TABLE accounts(
    id serial PRIMARY KEY NOT NULL,
    username varchar(20 ) NOT NULL UNIQUE,
    PASSWORD VARCHAR(100 ) NOT NULL,
    email varchar(100 ) NOT NULL UNIQUE
  );
END IF;
END
$$;
