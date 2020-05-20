BEGIN;

TRUNCATE
  belly_item_splitter
  RESTART IDENTITY CASCADE;

INSERT INTO belly_item_splitter (splitter_id, item_id, share_qty, created_at)
VALUES
  (1, 1, 1, '2020-01-02T23:28:56.782Z'),
  (2, 2, 1, '2020-01-03T23:28:56.782Z'),
  (1, 4, 1, '2020-01-02T23:28:56.782Z'),
  (2, 4, 1, '2020-01-03T23:28:56.782Z'),
  (1, 5, 1, '2020-01-02T23:28:56.782Z'),
  (2, 5, 1, '2020-01-03T23:28:56.782Z'),
  (1, 6, 1, '2020-01-02T23:28:56.782Z'),
  (2, 6, 1, '2020-01-03T23:28:56.782Z');

COMMIT;