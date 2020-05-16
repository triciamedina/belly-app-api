const express = require('express');
const path = require('path');
const  { requireAuth } = require('../middleware/jwt-auth');
const ViewService = require('./view-service');

const viewRouter = express.Router();
const bodyParser = express.json();

viewRouter
    .route('/')
    .all(requireAuth)
    .post(bodyParser, (req, res, next) => {
        const { id } = req.user;
        const { bill_id } = req.body;

        for (const field of ['bill_id']) {
            if (req.body[field] == null) {
                return res.status(400).json({
                    error: `Missing '${field}' in request body`
                })
            }
        };

        const newView = {
            user_id: id,
            bill_id
        };

        ViewService.insertView(
            req.app.get('db'),
            newView
        )
            .then(view => {
                return res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${view.id}`))
                    .json(ViewService.serializeView(view))
            })
            .catch(next)
    })

module.exports = viewRouter;