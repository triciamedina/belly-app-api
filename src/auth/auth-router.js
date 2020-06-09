const express = require('express');
const AuthService = require('./auth-service');
const authRouter = express.Router();
const bodyParser = express.json();

authRouter
    .post('/login', bodyParser, (req, res, next) => {
        const { username, password } = req.body;
        const loginUser = { username, password };

        for (const [key, value] of Object.entries(loginUser)) {
            if (value == null) {
                return res
                    .status(400)
                    .json({
                        message: `Missing '${key}' in request body`
                    })
            };

            AuthService.getUserWithUsername(
                req.app.get('db'),
                loginUser.username
            )
                .then(dbUser => {
                    if (!dbUser) {
                        return res
                            .status(400)
                            .json({
                                message: `Incorrect username or password`
                            })
                    };

                    return AuthService.comparePasswords(loginUser.password, dbUser.password)
                        .then(compareMatch => {
                            if (!compareMatch) {
                                return res
                                    .status(400)
                                    .json({
                                        message: `Incorrect username or password`
                                    })
                            };

                            const sub = dbUser.username;
                            const payload = { user_id: dbUser.id };

                            res.json({
                                authToken: AuthService.createJwt(sub, payload)
                            });
                        })
                })
                .catch(next)
        };
    });

module.exports = authRouter;