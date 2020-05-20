BEGIN;

TRUNCATE
  belly_splitter
  RESTART IDENTITY CASCADE;

INSERT INTO belly_splitter (nickname, avatar, created_at)
VALUES
    ('Sam', 'blue', '2020-01-02T23:28:56.782Z'),
    ('Frodo', 'pink', '2020-01-03T23:28:56.782Z');

COMMIT;