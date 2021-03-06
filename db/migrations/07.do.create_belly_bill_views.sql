CREATE TABLE belly_bill_views (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    user_id INTEGER REFERENCES belly_user(id) ON DELETE CASCADE,
    bill_id INTEGER REFERENCES belly_bill(id) ON DELETE CASCADE,
    last_viewed TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);