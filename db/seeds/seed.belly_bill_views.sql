BEGIN;

TRUNCATE
  belly_bill_views
  RESTART IDENTITY CASCADE;

INSERT INTO belly_bill_views (user_id, bill_id)
VALUES
    (1, 1),
    (1, 2),
    (1, 3),
    (1, 4);

COMMIT;