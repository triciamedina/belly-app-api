BEGIN;

TRUNCATE
  belly_user
  RESTART IDENTITY CASCADE;

INSERT INTO belly_user (username, avatar, password)
VALUES
    ('Sam', '#405cf7', '$2a$12$P.fk9nIrAHizny9LaWtBEucNmJAXsXy5MmM6twpEZsRAa6/7Cjisy'),
    ('Frodo', '#ca03a3', '$2a$12$a1gMxChnEZcZT7bZO/5qxOS/ZzX3OZDdBpzxvGA5XQ6fEyqHHTbeK');

COMMIT;