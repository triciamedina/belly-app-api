CREATE TABLE belly_user_bill (
    user_id INTEGER REFERENCES belly_user(id) ON DELETE CASCADE,
    bill_id INTEGER REFERENCES belly_bill(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, bill_id)
);