const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const bcrypt = require('bcryptjs');

describe('User Endpoints', function() {
    let db;

    const { testUsers, testBills, testUserBills }  = helpers.makeBellyFixtures();
    const testUser = testUsers[0];
    const token = helpers.makeAuthHeader(testUser);

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        });
        app.set('db', db);
    });

    after('disconnect from db', () => db.destroy());

    before('clean the table', () => helpers.cleanTables(db));

    afterEach('cleanup', () => helpers.cleanTables(db));

    describe(`GET /api/user`, () => {
        context(`Happy path`, () => {
            beforeEach('insert users', () =>
                helpers.seedUsers(
                    db, 
                    testUsers,
                )
            );

            it(`responds 200, serialized user`, () => {
                return supertest(app)
                    .get('/api/user')
                    .set({'Authorization': token})
                    .expect(200)
                    .expect(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body.username).to.eql(testUser.username)
                        expect(res.body).to.not.have.property('password')
                        expect(res.body.avatar).to.eql(testUser.avatar)
                        const expectedDate = new Date(testUser.created_at).toLocaleString()
                        const actualDate = new Date(res.body.created_at).toLocaleString()
                        expect(actualDate).to.eql(expectedDate)
                    })
            });
        });
    });

    describe(`POST /api/user`, () => {
        context(`User Validation`, () => {
            beforeEach('insert users', () =>
                helpers.seedUsers(
                    db, 
                    testUsers,
                )
            );

            const requiredFields = ['username', 'password', 'avatar'];

            requiredFields.forEach(field => {
                const registerAttemptBody = {
                    username: 'test username',
                    password: 'test password',
                    avatar: '#000000'
                };

                it(`responds with 400 required error when '${field}' is missing`, () => {
                    delete registerAttemptBody[field];

                    return supertest(app)
                        .post('/api/user')
                        .send(registerAttemptBody)
                        .expect(400, {
                            message: `Missing '${field}' in request body`
                        })
                });
            });

            it(`responds 400 'Password must be longer than 8 characters' when empty password`, () => {
                const userShortPassword = {
                    username: 'test username',
                    password: '1234567',
                    avatar: '#000000'
                };

                return supertest(app)
                    .post('/api/user')
                    .send(userShortPassword)
                    .expect(400, { message: `Password must be longer than 8 characters` })
            });

            it(`responds 400 'Password must be less than 36 characters' when long password`, () => {
                const userLongPassword = {
                    username: 'test username',
                    password: '*'.repeat(37),
                    avatar: '#000000'
                };

                return supertest(app)
                    .post('/api/user')
                    .send(userLongPassword)
                    .expect(400, { message: `Password must be less than 36 characters` })
            });

            it(`responds 400 error when password starts with spaces`, () => {
                const userPasswordStartsSpaces = {
                    username: 'test username',
                    password: ' 12345678',
                    avatar: '#000000'
                };

                return supertest(app)
                    .post('/api/user')
                    .send(userPasswordStartsSpaces)
                    .expect(400, { message: `Password must not start or end with empty spaces`})
            });

            it(`responds 400 error when password ends with spaces`, () => {
                const userPasswordEndsSpaces = {
                    username: 'test username',
                    password: '12345678 ',
                    avatar: '#000000'
                };

                return supertest(app)
                    .post('/api/user')
                    .send(userPasswordEndsSpaces)
                    .expect(400, { message: `Password must not start or end with empty spaces` })
            });

            it(`responds 400 error 'Account with this username already exists' when username isn't unique`, () => {
                const duplicateUser = {
                    username: testUser.username,
                    password: '12345678',
                    avatar: '#000000'
                };

                return supertest(app)
                    .post('/api/user')
                    .send(duplicateUser)
                    .expect(400, { message: `Account with this username already exists` })
            });
        });

        context(`Happy path`, () => {
            beforeEach('insert users', () =>
                helpers.seedUsers(
                    db, 
                    testUsers,
                )
            );
            
            it(`responds 201, serialized user, storing bcrypted password`, () => {
                const newUser = {
                    username: 'test username',
                    password: '12345678',
                    avatar: '#000000'
                };

                return supertest(app)
                    .post('/api/user')
                    .send(newUser)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body.username).to.eql(newUser.username)
                        expect(res.body).to.not.have.property('password')
                        expect(res.body.avatar).to.eql(newUser.avatar)
                        expect(res.headers.location).to.eql(`/api/user/${res.body.id}`)
                        const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                        const actualDate = new Date(res.body.created_at).toLocaleString()
                        expect(actualDate).to.eql(expectedDate)
                    })
                    .expect(res => 
                        db
                            .from('belly_user')
                            .select('*')
                            .where({ id: res.body.id })
                            .first()
                            .then(row => {
                                expect(row.username).to.eql(newUser.username)
                                expect(row.body.avatar).to.eql(newUser.avatar)
                                const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                                const actualDate = new Date(row.created_at).toLocaleString()
                                expect(actualDate).to.eql(expectedDate)

                                return bcrypt.compareSync(newUser.password, row.password)
                            })
                            .then(compareMatch => {
                                expect(compareMatch).to.be.true
                            })
                    )
            });
        });
    });

    describe(`GET /api/user/:bill_id`, () => {
        context(`Happy path`, () => {
            const userWithOwnedBill = testUser;
            const userWithOwnedBillToken = token;

            const userWithSharedBill = testUsers[1];
            const userWithSharedBillToken = helpers.makeAuthHeader(userWithSharedBill);

            const userWithNoBills = testUsers[2];
            const userWithNoBillsToken = helpers.makeAuthHeader(userWithNoBills);

            const billId = testBills[0].id;

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

            it(`responds 200, true when user owns bill`, () => {
                return supertest(app)
                    .get(`/api/user/${billId}`)
                    .set({'Authorization': userWithOwnedBillToken})
                    .expect(200, { hasBillWithId: true })
            });

            it(`responds 200, true when bill has been shared with user`, () => {
                return supertest(app)
                    .get(`/api/user/${billId}`)
                    .set({'Authorization': userWithSharedBillToken})
                    .expect(200, { hasBillWithId: true })
            });

            it(`responds 200, false when bill and user relation does not exist`, () => {
                return supertest(app)
                    .get(`/api/user/${billId}`)
                    .set({'Authorization': userWithNoBillsToken})
                    .expect(200, { hasBillWithId: false })
            });
        });
    });
});