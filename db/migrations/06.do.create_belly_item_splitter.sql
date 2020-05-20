CREATE TABLE belly_item_splitter (
    splitter_id INTEGER REFERENCES belly_splitter(id) ON DELETE CASCADE,
    item_id INTEGER REFERENCES belly_item(id) ON DELETE CASCADE,
    PRIMARY KEY (splitter_id, item_id),
    share_qty INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    deleted TIMESTAMP
);