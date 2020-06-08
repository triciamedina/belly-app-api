const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function makeBellyFixtures() {
    const testUsers = makeUsersArray();
    return { testUsers };
};

function makeUsersArray() {
    return [
        {
            id: 1,
            username: 'test-user-1',
            password: 'password1',
            avatar: '#FFFFFF',
            created_at: new Date('2020-01-01T23:28:56.782Z'),
        },
        {
            id: 2,
            username: 'test-user-2',
            password: 'password2',
            avatar: '#FFFFFF',
            created_at: new Date('2020-01-02T23:28:56.782Z'),
        },
        {
            id: 3,
            username: 'test-user-3',
            password: 'password3',
            avatar: '#FFFFFF',
            created_at: new Date('2020-01-03T23:28:56.782Z'),
        },
        {
            id: 4,
            username: 'test-user-4',
            password: 'password4',
            avatar: '#FFFFFF',
            created_at: new Date('2020-01-03T23:28:56.782Z'),
        },
    ]
};

function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 1)
    }));

    return db.into('belly_user').insert(preppedUsers)
        .then(() =>
            db.raw(
                `SELECT setval('belly_user_id_seq', ?)`,
                [users[users.length - 1].id],
            )
        )
};

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
        subject: user.username,
        algorithm: 'HS256'
    });

    return `Bearer ${token}`;
};

function cleanTables(db) {
    return db.transaction(trx =>
        trx.raw(
            `   
            BEGIN;
            TRUNCATE TABLE belly_bill_views CASCADE;
            TRUNCATE TABLE belly_item_splitter CASCADE;
            TRUNCATE TABLE belly_splitter CASCADE;
            TRUNCATE TABLE belly_item CASCADE;
            TRUNCATE TABLE belly_user_bill CASCADE;
            TRUNCATE TABLE belly_bill CASCADE;
            TRUNCATE TABLE belly_user CASCADE;
            COMMIT;
            `
        )
        .then(() =>
            Promise.all([
                trx.raw(`ALTER SEQUENCE belly_user_id_seq minvalue 0 START WITH 1`),
                trx.raw(`SELECT setval('belly_user_id_seq', 0)`),
                trx.raw(`ALTER SEQUENCE belly_bill_id_seq minvalue 0 START WITH 1`),
                trx.raw(`SELECT setval('belly_bill_id_seq', 0)`),
                trx.raw(`ALTER SEQUENCE belly_item_id_seq minvalue 0 START WITH 1`),
                trx.raw(`SELECT setval('belly_item_id_seq', 0)`),
                trx.raw(`ALTER SEQUENCE belly_splitter_id_seq minvalue 0 START WITH 1`),
                trx.raw(`SELECT setval('belly_splitter_id_seq', 0)`),
                trx.raw(`ALTER SEQUENCE belly_bill_views_id_seq minvalue 0 START WITH 1`),
                trx.raw(`SELECT setval('belly_bill_views_id_seq', 0)`),
            ])
        )
    )
};

module.exports = {
    makeUsersArray,
    makeBellyFixtures,
    cleanTables,
    seedUsers,
    makeAuthHeader
}