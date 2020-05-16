const express = require('express');
const path = require('path');
const  { requireAuth } = require('../middleware/jwt-auth');
const SplitterService = require('./splitter-service');

const splitterRouter = express.Router();
const bodyParser = express.json();

splitterRouter
    .route('/')
    .all(requireAuth)
    .all(bodyParser)
    .post((req, res, next) => {
        // add new splitter
        const { item_id, nickname, avatar, share_qty } = req.body;

        for (const field of ['item_id', 'nickname', 'avatar', 'share_qty']) {
            if (req.body[field] == null) {
                return res.status(400).json({
                    error: `Missing '${field}' in request body`
                })
            }
        };

        const newSplitter = {
            item_id,
            nickname,
            avatar,
            share_qty
        };

        SplitterService.insertSplitter(
            req.app.get('db'),
            newSplitter
        )
            .then(splitter => {
                return res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${splitter.id}`))
                    .json(SplitterService.serializeSplitter(splitter))
            })
            .catch(next)
    })
    .patch((req, res, next) => {
        // update splitter
    })

module.exports = splitterRouter;