const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function makeBellyFixtures() {
    const testUsers = makeUsersArray();
    const testBills = makeBillsArray();
    const testUserBills = makeUserBillsArray();
    const testItems = makeItemsArray();
    const testSplitters = makeSplittersArray();
    const testItemSplitters = makeItemSplitterArray();
    const testViews = makeViewsArray();
    return { testUsers, testBills, testUserBills, testItems, testSplitters, testItemSplitters, testViews };
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

function makeBillsArray() {
    return [
        {
            id: 1,
            owner: 1,
            bill_name: 'test-bill-1',
            bill_thumbnail: '🌯',
            discounts: 1,
            tax: 1.50,
            tip: 1.25,
            fees: 0.50,
            created_at: new Date('2020-01-01T23:28:56.782Z'),
        },
        {
            id: 2,
            owner: 2,
            bill_name: 'test-bill-2',
            bill_thumbnail: '🐓',
            discounts: 5.00,
            tax: 4.50,
            tip: 10.25,
            fees: 0,
            created_at: new Date('2020-01-02T23:28:56.782Z'),
        },
        {
            id: 3,
            owner: 1,
            bill_name: 'test-bill-3',
            bill_thumbnail: '🐓',
            discounts: 11.00,
            tax: 9.99,
            tip: 12.70,
            fees: 3.66,
            created_at: new Date('2020-01-03T23:28:56.782Z'),
        },
    ]
};

function makeUserBillsArray() {
    return [
        {
            user_id: 1,
            bill_id: 2
        },
        {
            user_id: 2,
            bill_id: 1
        },
    ]
};

function makeItemsArray() {
    return [
        {
            id: 1,
            bill_id: 1,
            item_name: 'test-item-1',
            quantity: 2,
            price: 8.99,
            created_at: new Date('2020-01-01T23:28:56.782Z')
        },
        {
            id: 2,
            bill_id: 1,
            item_name: 'test-item-2',
            quantity: 1,
            price: 4.99,
            created_at: new Date('2020-01-02T23:28:56.782Z')
        },
        {
            id: 3,
            bill_id: 2,
            item_name: 'test-item-3',
            quantity: 4,
            price: 12.99,
            created_at: new Date('2020-01-03T23:28:56.782Z')
        },
        {
            id: 4,
            bill_id: 3,
            item_name: 'test-item-4',
            quantity: 3,
            price: 2.99,
            created_at: new Date('2020-01-04T23:28:56.782Z')
        },
    ]
};

function makeSplittersArray() {
    return [
        {
            id: 1,
            nickname: 'test-splitter-1',
            avatar: '#FFFFFF',
            created_at: new Date('2020-01-01T23:28:56.782Z')
        },
        {
            id: 2,
            nickname: 'test-splitter-2',
            avatar: '#000000',
            created_at: new Date('2020-01-01T23:28:56.782Z')
        },
    ]
};

function makeItemSplitterArray() {
    return [
        {
            splitter_id: 1,
            item_id: 1,
            share_qty: 1,
            created_at: new Date('2020-01-01T23:28:56.782Z')
        },
        {
            splitter_id: 2,
            item_id: 1,
            share_qty: 1,
            created_at: new Date('2020-01-02T23:28:56.782Z')
        },
        {
            splitter_id: 1,
            item_id: 2,
            share_qty: 1,
            created_at: new Date('2020-01-01T23:28:56.782Z')
        },
        {
            splitter_id: 2,
            item_id: 2,
            share_qty: 1,
            created_at: new Date('2020-01-02T23:28:56.782Z')
        },
        {
            splitter_id: 1,
            item_id: 3,
            share_qty: 1,
            created_at: new Date('2020-01-01T23:28:56.782Z')
        },
        {
            splitter_id: 2,
            item_id: 4,
            share_qty: 1,
            created_at: new Date('2020-01-02T23:28:56.782Z')
        },
    ]
};

function makeViewsArray() {
    return [
        {
            id: 1,
            user_id: 1,
            bill_id: 1, 
            last_viewed: new Date('2020-01-01T23:28:56.782Z')
        },
        {
            id: 2,
            user_id: 1,
            bill_id: 2, 
            last_viewed: new Date('2020-01-02T23:28:56.782Z')
        },
        {
            id: 3,
            user_id: 1,
            bill_id: 3, 
            last_viewed: new Date('2020-01-03T23:28:56.782Z')
        },
        {
            id: 4,
            user_id: 2,
            bill_id: 3, 
            last_viewed: new Date('2020-01-04T23:28:56.782Z')
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

function seedBills(db, bills) {
    return db.into('belly_bill').insert(bills)
        .then(() =>
            db.raw(
                `SELECT setval('belly_bill_id_seq', ?)`,
                [bills[bills.length - 1].id],
            )
        )
};

function seedUserBills(db, userBills) {
    return db.into('belly_user_bill').insert(userBills);
};

function seedItems(db, items) {
    return db.into('belly_item').insert(items)
        .then(() =>
            db.raw(
                `SELECT setval('belly_item_id_seq', ?)`,
                [items[items.length - 1].id],
            )
        )
};

function seedSplitters(db, splitters) {
    return db.into('belly_splitter').insert(splitters)
        .then(() =>
            db.raw(
                `SELECT setval('belly_splitter_id_seq', ?)`,
                [splitters[splitters.length - 1].id],
            )
        )
};

function seedItemSplitters(db, itemSplitters) {
    return db.into('belly_item_splitter').insert(itemSplitters);
};

function seedViews(db, views) {
    return db.into('belly_bill_views').insert(views)
        .then(() => 
            db.raw(
                `SELECT setval('belly_bill_views_id_seq', ?)`,
                [views[views.length - 1].id],
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
    seedBills,
    seedUserBills,
    makeAuthHeader,
    seedItems,
    seedSplitters,
    seedItemSplitters,
    seedViews
};