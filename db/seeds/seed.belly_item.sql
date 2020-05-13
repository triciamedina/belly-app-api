BEGIN;

TRUNCATE
  belly_item
  RESTART IDENTITY CASCADE;

INSERT INTO belly_item (bill_id, item_name, quantity, price, created_at)
VALUES
    (1, 'Sisig Burrito', 1, 8.99, '2020-01-02T23:28:56.782Z'), 
    (1, 'Tosilog Burrito', 1, 8.99, '2020-01-03T23:28:56.782Z'),
    (1, 'Sisig With Rice', 1, 8.99, '2020-01-04T23:28:56.782Z'),
    (2, 'Lek Tom Yum Haeng', 2, 13.95, '2020-02-01T23:28:56.782Z'),
    (3, 'Spiced Chicken Salad', 5, 14, '2020-02-01T23:28:56.782Z'),
    (4, 'The Original', 2, 15.95, '2020-01-02T23:28:56.782Z');

COMMIT;