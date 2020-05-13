BEGIN;

TRUNCATE
  belly_bill
  RESTART IDENTITY CASCADE;

INSERT INTO belly_bill (owner, bill_name, bill_thumbnail, discounts, tax, tip, fees, created_at)
VALUES
    (1, 'Señor Sisig', '🌯', 0, 2.50, 5, 3, '2020-01-01T23:28:56.782Z'), 
    (1, 'Lers Ros', '🍜', 0, 2.38, 4, 0.10, '2020-02-01T23:28:56.782Z'),
    (1, 'The Spice Jar', '🥘', 0, 4.76, 8, 0, '2020-03-01T23:28:56.782Z'),
    (2, 'Rooster & Rice', '🐓', 0, 1.99, 2, 0, '2020-01-01T23:28:56.782Z');

COMMIT;