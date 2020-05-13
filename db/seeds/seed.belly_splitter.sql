BEGIN;

TRUNCATE
  belly_splitter
  RESTART IDENTITY CASCADE;

INSERT INTO belly_splitter (item_id, nickname, avatar, share_qty, created_at)
VALUES
    (1, 'Sam', 'blue', 1, '2020-01-02T23:28:56.782Z'),
    (2, 'Frodo', 'pink', 1, '2020-01-03T23:28:56.782Z'),
    (4, 'Sam', 'blue', 1, '2020-01-02T23:28:56.782Z'),
    (4, 'Frodo', 'pink', 1, '2020-01-03T23:28:56.782Z'),
    (5, 'Sam', 'blue', 1, '2020-01-02T23:28:56.782Z'),
    (5, 'Frodo', 'pink', 1, '2020-01-03T23:28:56.782Z'),
    (6, 'Sam', 'blue', 1, '2020-01-02T23:28:56.782Z'),
    (6, 'Frodo', 'pink', 1, '2020-01-03T23:28:56.782Z');

COMMIT;