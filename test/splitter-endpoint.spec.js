const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Splitter Endpoints', function() {
    let db;

    const { testUsers, testBills, testUserBills, testItems, testSplitters, testItemSplitters, testViews }  = helpers.makeBellyFixtures();
    const testUser = testUsers[0];
    const testSplitter = testSplitters[0];
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

            it(`responds 201, serialized item`, () => {

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
        const updatedSplitter = {
            nickname: 'updated-splitter',
            avatar: '#000000',
        };

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

});