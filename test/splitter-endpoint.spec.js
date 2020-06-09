const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Splitter Endpoints', function() {
    let db;

    const { testUsers, testBills, testItems, testSplitters, testItemSplitters }  = helpers.makeBellyFixtures();
    const testUser = testUsers[0];
    const testSplitter = testSplitters[0];
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

    describe(`POST /api/splitter`, () => {
        context(`Happy path`, () => {
            beforeEach('insert users', () =>
                helpers.seedUsers(
                    db, 
                    testUsers,
                )
            );

            it(`responds 201, serialized splitter`, () => {

                const newSplitter = {
                    nickname: 'test splitter',
                    avatar: '#FFFFFF',
                };

                return supertest(app)
                    .post('/api/splitter')
                    .set({'Authorization': token})
                    .send(newSplitter)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body.nickname).to.eql(newSplitter.nickname)
                        expect(res.body.avatar).to.eql(newSplitter.avatar)
                        const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                        const actualDate = new Date(res.body.created_at).toLocaleString()
                        expect(actualDate).to.eql(expectedDate)
                    })
                    .expect(res => 
                        db
                            .from('belly_splitter')
                            .select('*')
                            .where({ id: res.body.id })
                            .first()
                            .then(row => {
                                expect(row.nickname).to.eql(newSplitter.nickname)
                                expect(row.avatar).to.eql(newSplitter.avatar)
                                const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                                const actualDate = new Date(row.created_at).toLocaleString()
                                expect(actualDate).to.eql(expectedDate)
                            })
                    )
            });
        });
    });

    describe(`PATCH /api/splitter/:splitter_id`, () => {

        beforeEach('insert users', () =>
            helpers.seedUsers(
                db, 
                testUsers,
            )
        );

        beforeEach('insert splitters', () =>
            helpers.seedSplitters(
                db, 
                testSplitters,
            )
        );

        context(`Happy path`, () => {

            const updatedSplitter = {
                nickname: 'updated-splitter',
                avatar: '#000000',
            };

            it(`responds 200, serialized splitter`, () => {
                return supertest(app)
                    .patch(`/api/splitter/${testSplitter.id}`)
                    .set({'Authorization': token})
                    .send(updatedSplitter)
                    .expect(200)
                    .expect(res => {
                        expect(res.body.id).to.eql(testSplitter.id)
                        expect(res.body.nickname).to.eql(updatedSplitter.nickname)
                        expect(res.body.avatar).to.eql(updatedSplitter.avatar)
                    })
                    .expect(res => 
                        db
                            .from('belly_splitter')
                            .select('*')
                            .where({ id: testSplitter.id })
                            .first()
                            .then(row => {
                                expect(row.nickname).to.eql(updatedSplitter.nickname)
                                expect(row.avatar).to.eql(updatedSplitter.avatar)
                            })
                    )
            });
        });
    });

    describe(`POST /api/splitter/:splitter_id/:item_id`, () => {

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

        context(`Happy path`, () => {

            const newSplit = {
                splitter_id: testSplitter.id,
                item_id: testItem.id,
                share_qty: 1
            };

            it(`responds 201, serialized split`, () => {
                return supertest(app)
                    .post(`/api/splitter/${testSplitter.id}/${testItem.id}`)
                    .set({'Authorization': token})
                    .send(newSplit)
                    .expect(201)
                    .expect(res => {
                        expect(res.body.splitter_id).to.eql(newSplit.splitter_id)
                        expect(res.body.item_id).to.eql(newSplit.item_id)
                        expect(res.body.share_qty).to.eql(newSplit.share_qty)
                        expect(res.headers.location).to.eql(`/api/splitter/${res.body.splitter_id}/${res.body.item_id}/${res.body.splitter_id}`)
                        const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                        const actualDate = new Date(res.body.created_at).toLocaleString()
                        expect(actualDate).to.eql(expectedDate)
                    })
                    .expect(res => 
                        db
                            .from('belly_item_splitter')
                            .select('*')
                            .where({ splitter_id: newSplit.splitter_id, item_id: newSplit.item_id })
                            .first()
                            .then(row => {
                                expect(row.item_id).to.eql(newSplit.item_id)
                                expect(row.splitter_id).to.eql(newSplit.splitter_id)
                                expect(row.share_qty).to.eql(newSplit.share_qty)
                                expect(row.deleted).to.be.null
                                const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                                const actualDate = new Date(row.created_at).toLocaleString()
                                expect(actualDate).to.eql(expectedDate)
                            })
                    )
            });
        });
    });

    describe(`PATCH /api/splitter/:splitter_id/:item_id`, () => {

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
                testItemSplitters
            )
        );

        context(`Happy path`, () => {

            const updatedSplit = {
                share_qty: 5,
            };

            it(`responds 200, serialized split`, () => {
                return supertest(app)
                    .patch(`/api/splitter/${testSplitter.id}/${testItem.id}`)
                    .set({'Authorization': token})
                    .send(updatedSplit)
                    .expect(200)
                    .expect(res => {
                        expect(res.body.splitter_id).to.eql(testSplitter.id)
                        expect(res.body.item_id).to.eql(testItem.id)
                        expect(res.body.share_qty).to.eql(updatedSplit.share_qty)
                    })
                    .expect(res => 
                        db
                            .from('belly_item_splitter')
                            .select('*')
                            .where({ splitter_id: testSplitter.id, item_id: testItem.id })
                            .first()
                            .then(row => {
                                expect(row.splitter_id).to.eql(testSplitter.id)
                                expect(row.item_id).to.eql(testItem.id)
                                expect(row.share_qty).to.eql(updatedSplit.share_qty)
                            })
                    )
            });
        });
    });
});