CREATE TABLE belly_bill (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    owner INTEGER REFERENCES belly_user(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    bill_name TEXT NOT NULL,
    bill_thumbnail TEXT NOT NULL,
    discounts NUMERIC (8, 2) NOT NULL,
    tax NUMERIC (8, 2) NOT NULL,
    tip NUMERIC (8, 2) NOT NULL,
    fees NUMERIC (8, 2) NOT NULL
);