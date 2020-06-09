const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Bill Endpoints', function() {
    let db;

    const { testUsers, testBills, testUserBills, testItems, testSplitters, testItemSplitters, testViews }  = helpers.makeBellyFixtures();
    const testUser = testUsers[0];
    const testItem = testItems[0];
    const token = helpers.makeAuthHeader(testUser);

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    });

    after('disconnect from db', () => db.destroy());

    before('clean the table', () => helpers.cleanTables(db));

    afterEach('cleanup', () => helpers.cleanTables(db));

    describe(`POST /api/item`, () => {
        context(`Happy path`, () => {
            beforeEach('insert users', () =>
                helpers.seedUsers(
                    db, 
                    testUsers,
                )
            );

            beforeEach('insert bills', () =>
                helpers.seedBills(
                    db, 
                    testBills,
                )
            );

            beforeEach('insert user bill relations', () =>
                helpers.seedUserBills(
                    db, 
                    testUserBills,
                )
            );

            it(`responds 201, serialized item`, () => {
                const newItem = {
                    itemName: 'test item',
                    quantity: 2,
                    price: 4.25,
                    bill_id: 1
                };

                return supertest(app)
                    .post('/api/item')
                    .set({'Authorization': token})
                    .send(newItem)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body.bill_id).to.eql(newItem.bill_id)
                        expect(res.body.item_name).to.eql(newItem.itemName)
                        expect(Number(res.body.quantity)).to.eql(newItem.quantity)
                        expect(Number(res.body.price)).to.eql(newItem.price)
                        expect(res.headers.location).to.eql(`/api/item/${res.body.id}`)
                        const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                        const actualDate = new Date(res.body.created_at).toLocaleString()
                        expect(actualDate).to.eql(expectedDate)
                    })
                    .expect(res => 
                        db
                            .from('belly_item')
                            .select('*')
                            .where({ id: res.body.id })
                            .first()
                            .then(row => {
                                expect(row.bill_id).to.eql(newItem.bill_id)
                                expect(row.item_name).to.eql(newItem.itemName)
                                expect(row.quantity).to.eql(newItem.quantity)
                                const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                                const actualDate = new Date(row.created_at).toLocaleString()
                                expect(actualDate).to.eql(expectedDate)
                            })
                    )
            });
        });
    });

    describe(`GET /api/item`, () => {
        context(`Happy path`, () => {
            beforeEach('insert users', () =>
                helpers.seedUsers(
                    db, 
                    testUsers,
                )
            );

            beforeEach('insert bills', () =>
                helpers.seedBills(
                    db, 
                    testBills,
                )
            );

            beforeEach('insert user bill relations', () =>
                helpers.seedUserBills(
                    db, 
                    testUserBills,
                )
            );

            beforeEach('insert items', () =>
                helpers.seedItems(
                    db, 
                    testItems,
                )
            );

            it(`responds 200, serialized item`, () => {
                return supertest(app)
                    .get(`/api/item/${testItem.id}`)
                    .set({'Authorization': token})
                    .expect(200)
                    .expect(res => {
                        expect(res.body.id).to.eql(testItem.id)
                        expect(res.body.bill_id).to.eql(testItem.bill_id)
                        expect(res.body.item_name).to.eql(testItem.item_name)
                        expect(Number(res.body.quantity)).to.eql(testItem.quantity)
                        expect(Number(res.body.price)).to.eql(testItem.price)
                        expect(new Date(res.body.created_at)).to.eql(testItem.created_at)
                    })
            });
        });
    });
});