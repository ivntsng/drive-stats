DO $$
BEGIN
  IF EXISTS(
    SELECT
    FROM
      pg_tables
    WHERE
      schemaname = 'public'
      AND tablename = 'bug_report') THEN
  ALTER TABLE bug_report
    ALTER COLUMN bug_title SET NOT NULL,
    ALTER COLUMN bug_desc SET NOT NULL,
    ALTER COLUMN bug_behavior SET NOT NULL,
    ALTER COLUMN bug_rating SET NOT NULL,
    ALTER COLUMN created_date SET NOT NULL;
END IF;
END
$$
