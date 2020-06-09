const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Bill Endpoints', function() {
    let db;

    const { testUsers, testBills, testUserBills, testItems, testSplitters, testItemSplitters, testViews }  = helpers.makeBellyFixtures();
    const testUser = testUsers[0];
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

    describe(`GET /api/bill/:type`, () => {
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

            beforeEach('insert splitters', () =>
                helpers.seedSplitters(
                    db, 
                    testSplitters,
                )
            );

            beforeEach('insert item splitter relations', () =>
                helpers.seedItemSplitters(
                    db, 
                    testItemSplitters,
                )
            );

            beforeEach('insert views', () =>
                helpers.seedViews(
                    db, 
                    testViews,
                )
            );

            it(`responds 200, array of serialized owned bills`, () => {
                return supertest(app)
                    .get('/api/bill/owned')
                    .set({'Authorization': token})
                    .expect(200)
                    .expect(res => {
                        for (const field of [0, 1]) {
                            expect(res.body.ownedByMe[field]).to.have.property('id')
                            expect(res.body.ownedByMe[field].owner).to.eql(testUser.id)
                            expect(res.body.ownedByMe[field]).to.have.property('created_at')
                            expect(res.body.ownedByMe[field]).to.have.property('bill_name')
                            expect(res.body.ownedByMe[field]).to.have.property('last_viewed')
                            expect(res.body.ownedByMe[field]).to.have.property('discounts')
                            expect(res.body.ownedByMe[field]).to.have.property('tax')
                            expect(res.body.ownedByMe[field]).to.have.property('tip')
                            expect(res.body.ownedByMe[field]).to.have.property('fees')
                            expect(res.body.ownedByMe[field]).to.have.property('items')
                            const items = res.body.ownedByMe[field].items
                            expect(items).to.be.an('array')
                        }
                    })
            });

            it(`responds 200, array of serialized shared bills`, () => {
                return supertest(app)
                    .get('/api/bill/shared')
                    .set({'Authorization': token})
                    .expect(200)
                    .expect(res => {
                        for (const field of [0]) {
                            expect(res.body.sharedWithMe[field]).to.have.property('id')
                            expect(res.body.sharedWithMe[field]).to.have.property('created_at')
                            expect(res.body.sharedWithMe[field]).to.have.property('bill_name')
                            expect(res.body.sharedWithMe[field]).to.have.property('last_viewed')
                            expect(res.body.sharedWithMe[field]).to.have.property('discounts')
                            expect(res.body.sharedWithMe[field]).to.have.property('tax')
                            expect(res.body.sharedWithMe[field]).to.have.property('tip')
                            expect(res.body.sharedWithMe[field]).to.have.property('fees')
                            expect(res.body.sharedWithMe[field]).to.have.property('items')
                            const items = res.body.sharedWithMe[field].items
                            expect(items).to.be.an('array')
                        }
                    })
            });
        });
    });

    describe(`POST /api/bill/:type`, () => {
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

            it(`responds 201, serialized owned bill`, () => {

                const newBill = {
                    billName: 'test bill',
                    billThumbnail: '🍜',
                    discounts: 3.50,
                    tax: 2.95,
                    tip: 5.55,
                    fees: 2.00
                };

                return supertest(app)
                    .post('/api/bill/owned')
                    .set({'Authorization': token})
                    .send(newBill)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body.owner).to.eql(testUser.id)
                        expect(res.body.bill_name).to.eql(newBill.billName)
                        expect(res.body.bill_thumbnail).to.eql(newBill.billThumbnail)
                        expect(Number(res.body.discounts)).to.eql(newBill.discounts)
                        expect(Number(res.body.tax)).to.eql(newBill.tax)
                        expect(Number(res.body.tip)).to.eql(newBill.tip)
                        expect(Number(res.body.fees)).to.eql(newBill.fees)
                        expect(res.headers.location).to.eql(`/api/bill/owned/${res.body.id}`)
                        const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                        const actualDate = new Date(res.body.created_at).toLocaleString()
                        expect(actualDate).to.eql(expectedDate)
                    })
                    .expect(res => 
                        db
                            .from('belly_bill')
                            .select('*')
                            .where({ id: res.body.id })
                            .first()
                            .then(row => {
                                expect(row.owner).to.eql(testUser.id)
                                expect(row.bill_name).to.eql(newBill.billName)
                                expect(row.bill_thumbnail).to.eql(newBill.billThumbnail)
                                expect(Number(row.discounts)).to.eql(newBill.discounts)
                                expect(Number(row.tax)).to.eql(newBill.tax)
                                expect(Number(row.tip)).to.eql(newBill.tip)
                                expect(Number(row.fees)).to.eql(newBill.fees)
                                const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                                const actualDate = new Date(row.created_at).toLocaleString()
                                expect(actualDate).to.eql(expectedDate)
                            })
                    )
            });

            it(`responds 201, serialized shared bill`, () => {
                const testSharedBill = testBills[2];
                const newSharedBill = { bill_id: testSharedBill.id };

                return supertest(app)
                    .post('/api/bill/shared')
                    .set({'Authorization': token})
                    .send(newSharedBill)
                    .expect(201)
                    .expect(res => {
                        expect(res.body.id).to.eql(testSharedBill.id)
                        expect(res.body.bill_name).to.eql(testSharedBill.bill_name)
                        expect(res.body.bill_thumbnail).to.eql(testSharedBill.bill_thumbnail)
                        expect(Number(res.body.discounts)).to.eql(testSharedBill.discounts)
                        expect(Number(res.body.tax)).to.eql(testSharedBill.tax)
                        expect(Number(res.body.tip)).to.eql(testSharedBill.tip)
                        expect(Number(res.body.fees)).to.eql(testSharedBill.fees)
                        expect(res.headers.location).to.eql(`/api/bill/shared/${res.body.id}`)
                    })
                    .expect(res => 
                        db
                            .from('belly_user_bill')
                            .select('*')
                            .where({ user_id: testUser.id, bill_id: res.body.id })
                            .first()
                            .then(row => {
                                expect(row.user_id).to.eql(testUser.id)
                                expect(row.bill_id).to.eql(res.body.id)
                            })
                    )
            });
        });
    });

    describe(`GET /api/bill/:type/:bill_id`, () => {
        context(`Happy path`, () => {

            const ownedBill = testBills[0];
            const sharedBill = testBills[1];

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

            it(`responds 200, serialized bill when user owns bill`, () => {
                return supertest(app)
                    .get(`/api/bill/owned/${ownedBill.id}`)
                    .set({'Authorization': token})
                    .expect(200)
                    .expect(res => {
                        expect(res.body.existingBill.id).to.eql(ownedBill.id)
                        expect(res.body.existingBill.owner).to.eql(ownedBill.owner)
                        expect(res.body.existingBill.bill_name).to.eql(ownedBill.bill_name)
                        expect(res.body.existingBill.bill_thumbnail).to.eql(ownedBill.bill_thumbnail)
                        expect(Number(res.body.existingBill.discounts)).to.eql(ownedBill.discounts)
                        expect(Number(res.body.existingBill.tax)).to.eql(ownedBill.tax)
                        expect(Number(res.body.existingBill.tip)).to.eql(ownedBill.tip)
                        expect(Number(res.body.existingBill.fees)).to.eql(ownedBill.fees)
                    })
            });

            it(`responds 200, serialized bill when bill has been shared with user`, () => {
                return supertest(app)
                    .get(`/api/bill/shared/${sharedBill.id}`)
                    .set({'Authorization': token })
                    .expect(200)
                    .expect(res => {
                        expect(res.body.existingBill.id).to.eql(sharedBill.id)
                        expect(res.body.existingBill.owner).to.eql(sharedBill.owner)
                        expect(res.body.existingBill.bill_name).to.eql(sharedBill.bill_name)
                        expect(res.body.existingBill.bill_thumbnail).to.eql(sharedBill.bill_thumbnail)
                        expect(Number(res.body.existingBill.discounts)).to.eql(sharedBill.discounts)
                        expect(Number(res.body.existingBill.tax)).to.eql(sharedBill.tax)
                        expect(Number(res.body.existingBill.tip)).to.eql(sharedBill.tip)
                        expect(Number(res.body.existingBill.fees)).to.eql(sharedBill.fees)
                    })
            });
        });
    });

    describe(`PATCH /api/bill/:type/:bill_id`, () => {
        context(`Happy path`, () => {

            const ownedBill = testBills[0];
            const sharedBill = testBills[1];

            const updatedBill = {
                billName: 'test bill',
                billThumbnail: '🍜',
                discounts: 3.50,
                tax: 2.95,
                tip: 5.55,
                fees: 2.00
            };

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

            it(`responds 200, serialized bill when user owns bill`, () => {
                return supertest(app)
                    .patch(`/api/bill/owned/${ownedBill.id}`)
                    .set({'Authorization': token})
                    .send(updatedBill)
                    .expect(200)
                    .expect(res => {
                        expect(res.body.id).to.eql(ownedBill.id)
                        expect(res.body.owner).to.eql(ownedBill.owner)
                        expect(res.body.bill_name).to.eql(updatedBill.billName)
                        expect(res.body.bill_thumbnail).to.eql(updatedBill.billThumbnail)
                        expect(Number(res.body.discounts)).to.eql(updatedBill.discounts)
                        expect(Number(res.body.tax)).to.eql(updatedBill.tax)
                        expect(Number(res.body.tip)).to.eql(updatedBill.tip)
                        expect(Number(res.body.fees)).to.eql(updatedBill.fees)
                    })
                    .expect(res => 
                        db
                            .from('belly_bill')
                            .select('*')
                            .where({ id: ownedBill.id })
                            .first()
                            .then(row => {
                                expect(row.bill_name).to.eql(updatedBill.bill_name)
                                expect(row.bill_thumbnail).to.eql(updatedBill.bill_thumbnail)
                                expect(Number(row.discounts)).to.eql(updatedBill.discounts)
                                expect(Number(row.tax)).to.eql(updatedBill.tax)
                                expect(Number(row.tip)).to.eql(updatedBill.tip)
                                expect(Number(row.fees)).to.eql(updatedBill.fees)
                            })
                    )
            });

            it(`responds 200, serialized bill when user has shared bill`, () => {
                return supertest(app)
                    .patch(`/api/bill/shared/${sharedBill.id}`)
                    .set({'Authorization': token})
                    .send(updatedBill)
                    .expect(200)
                    .expect(res => {
                        expect(res.body.id).to.eql(sharedBill.id)
                        expect(res.body.owner).to.eql(sharedBill.owner)
                        expect(res.body.bill_name).to.eql(updatedBill.billName)
                        expect(res.body.bill_thumbnail).to.eql(updatedBill.billThumbnail)
                        expect(Number(res.body.discounts)).to.eql(updatedBill.discounts)
                        expect(Number(res.body.tax)).to.eql(updatedBill.tax)
                        expect(Number(res.body.tip)).to.eql(updatedBill.tip)
                        expect(Number(res.body.fees)).to.eql(updatedBill.fees)
                    })
                    .expect(res => 
                        db
                            .from('belly_bill')
                            .select('*')
                            .where({ id: sharedBill.id })
                            .first()
                            .then(row => {
                                expect(row.bill_name).to.eql(updatedBill.bill_name)
                                expect(row.bill_thumbnail).to.eql(updatedBill.bill_thumbnail)
                                expect(Number(row.discounts)).to.eql(updatedBill.discounts)
                                expect(Number(row.tax)).to.eql(updatedBill.tax)
                                expect(Number(row.tip)).to.eql(updatedBill.tip)
                                expect(Number(row.fees)).to.eql(updatedBill.fees)
                            })
                    )
            });
        });
    });
});