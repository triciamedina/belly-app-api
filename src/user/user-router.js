const express = require('express');
const path = require('path');
const moment = require('moment');
const UserService = require('./user-service');

const userRouter = express.Router();
const bodyParser = express.json();

userRouter
    .route('/')
    .all(bodyParser)
    .post((req, res, next) => {
        const { username, password, avatar } = req.body;

        for (const field of ['username', 'password', 'avatar']) {
            if (!req.body[field]) {
                return res
                    .status(400)
                    .json({
                        error: `Missing '${field}' in request body`
                    })
            }
        };

        const passwordError = UserService.validatePassword(password);

        if (passwordError) {
            return res
                .status(400)
                .json({ 
                    error: passwordError
                })
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
                            error: `Account with this username already exists` 
                        })
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

module.exports = userRouter;