DO $$
BEGIN
  IF NOT EXISTS(
    SELECT
    FROM
      pg_tables
    WHERE
      schemaname = 'public'
      AND tablename = 'bug_report') THEN
  CREATE TABLE bug_report(
    id serial PRIMARY KEY,
    bug_title varchar(200 ),
    bug_desc varchar,
    bug_behavior varchar,
    bug_rating varchar,
    created_date timestamp DEFAULT CURRENT_TIMESTAMP,
    user_id integer NOT NULL REFERENCES accounts(id ) ON DELETE CASCADE
  );
END IF;
END
$$;
