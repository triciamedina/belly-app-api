BEGIN;

TRUNCATE
  belly_user
  RESTART IDENTITY CASCADE;

INSERT INTO belly_user (username, avatar, password)
VALUES
    ('Sam', 'blue', '$2a$12$P.fk9nIrAHizny9LaWtBEucNmJAXsXy5MmM6twpEZsRAa6/7Cjisy'),
    ('Frodo', 'pink', '$2a$12$a1gMxChnEZcZT7bZO/5qxOS/ZzX3OZDdBpzxvGA5XQ6fEyqHHTbeK');

COMMIT;