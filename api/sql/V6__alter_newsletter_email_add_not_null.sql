DO $$
BEGIN
  -- Check if the table 'newsletter_subscribers' already exists
  IF NOT EXISTS(
    SELECT
      1
    FROM
      pg_tables
    WHERE
      schemaname = 'public'
      AND tablename = 'newsletter_subscribers') THEN
  -- Create the table if it does not exist
  CREATE TABLE newsletter_subscribers(
    id serial PRIMARY KEY,
    subscriber_email varchar(254 ) NOT NULL UNIQUE
  );
END IF;
END
$$;
