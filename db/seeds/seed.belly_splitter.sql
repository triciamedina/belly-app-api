BEGIN;

TRUNCATE
  belly_splitter
  RESTART IDENTITY CASCADE;

INSERT INTO belly_splitter (nickname, avatar, created_at)
VALUES
    ('Sam', '#405cf7', '2020-01-02T23:28:56.782Z'),
    ('Frodo', '#ca03a3', '2020-01-03T23:28:56.782Z');

COMMIT;