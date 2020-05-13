BEGIN;

TRUNCATE
  belly_user_bill
  RESTART IDENTITY CASCADE;

INSERT INTO belly_user_bill (user_id, bill_id)
VALUES
    (1, 4);

COMMIT;