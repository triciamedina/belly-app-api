const express = require('express');
const path = require('path');
const UserService = require('./user-service');
const BillService = require('../bill/bill-service');
const  { requireAuth } = require('../middleware/jwt-auth');

const userRouter = express.Router();
const bodyParser = express.json();

userRouter
    .route('/')
    .get(requireAuth, (req, res, next) => {
        const { id } = req.user;

        UserService.getUser(
            req.app.get('db'),
            id
        )
            .then(user => {
                res
                    .status(200)
                    .json(UserService.serializeUser(user))
        })
        .catch(next)
    })
    .post(bodyParser, (req, res, next) => {
        const { username, password, avatar } = req.body;

        for (const field of ['username', 'password', 'avatar']) {
            if (!req.body[field]) {
                return res
                    .status(400)
                    .json({
                        message: `Missing '${field}' in request body`
                    });
            };
        };

        const passwordError = UserService.validatePassword(password);

        if (passwordError) {
            return res
                .status(400)
                .json({ 
                    message: passwordError
                });
        };

        UserService.hasUserWithUsername(
            req.app.get('db'),
            username,
        )
            .then(hasUserWithUsername => {
                if (hasUserWithUsername) {
                    return res
                        .status(400)
                        .json({ 
                            message: `Account with this username already exists` 
                        });
                };
                
                return UserService.hashPassword(password)
                    .then(hashedPassword => {
                        const newUser = {
                            username,
                            password: hashedPassword,
                            avatar
                        };
                        
                        return UserService.insertUser(
                            req.app.get('db'),
                            newUser
                        )
                            .then(user => {
                                res
                                    .status(201)
                                    .location(path.posix.join(req.originalUrl, `/${user.id}`))
                                    .json(UserService.serializeUser(user))
                            })
                    })
            })
            .catch(next)
    });

userRouter
    .route('/:bill_id')
    .get(requireAuth, (req, res, next) => {
        const { id } = req.user;
        const { bill_id } = req.params;

        BillService.hasOwnedBillWithId(
            req.app.get('db'),
            id,
            bill_id
        )
            .then(hasOwnedBillWithId => {
                if (!hasOwnedBillWithId) {
                    BillService.hasSharedBillWithId(
                        req.app.get('db'),
                        id, 
                        bill_id
                    )
                        .then(hasSharedBillWithId => {
                            if (!hasSharedBillWithId) {
                                res
                                .status(200)
                                .json({ hasBillWithId: false })
                            } else {
                                res
                                .status(200)
                                .json({ hasBillWithId: true })
                            }
                        })
                } else {
                    res
                        .status(200)
                        .json({ hasBillWithId: true })
                }
            })
            .catch(next)
    })

module.exports = userRouter;