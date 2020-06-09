const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Splitter Endpoints', function() {
    let db;

    const { testUsers, testBills }  = helpers.makeBellyFixtures();
    const testUser = testUsers[0];
    const testBill = testBills[0];
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

    describe(`POST /api/view`, () => {
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

            it(`responds 201, serialized view`, () => {

                const newView = {
                    bill_id: testBill.id
                };

                return supertest(app)
                    .post('/api/view')
                    .set({'Authorization': token})
                    .send(newView)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body.bill_id).to.eql(newView.bill_id)
                        expect(res.body.user_id).to.eql(testUser.id)
                        expect(res.headers.location).to.eql(`/api/view/${res.body.id}`)
                        const expectedDate = new Date().toLocaleString('en')
                        const actualDate = new Date(res.body.last_viewed).toLocaleString()
                        expect(actualDate).to.eql(expectedDate)
                    })
                    .expect(res => 
                        db
                            .from('belly_view')
                            .select('*')
                            .where({ bill_id: newView.bill_id, user_id: testUser.id })
                            .first()
                            .then(row => {
                                expect(row.bill_id).to.eql(newView.bill_id)
                                expect(row.user_id).to.eql(testUser.id)
                                const expectedDate = new Date().toLocaleString('en')
                                const actualDate = new Date(row.created_at).toLocaleString()
                                expect(actualDate).to.eql(expectedDate)
                            })
                    )
            });
        });
    });
});