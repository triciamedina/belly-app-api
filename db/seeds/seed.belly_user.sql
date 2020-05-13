BEGIN;

TRUNCATE
  belly_user
  RESTART IDENTITY CASCADE;

INSERT INTO belly_user (username, avatar, password)
VALUES
    ('Sam', 'blue', '$2a$12$6ZBazqxmznnSJzkRtqUpjeYzjEIT14VRWnsCRkldpXL.3V1Ca3/oa'),
    ('Frodo', 'pink', '$2a$12$hSmorkziJZmtnkKUXUWGv.QFHkVdF0TKgBBLt60xKhDlDs0Q0gN4S');

COMMIT;