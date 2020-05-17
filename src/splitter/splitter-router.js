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

splitterRouter
    .route('/:splitter_id')
    .all(requireAuth)
    .all(bodyParser)
    .patch((req, res, next) => {
        // update splitter
        const { splitter_id } = req.params;

        const { 
            nickname = undefined,
            avatar = undefined,
            share_qty = undefined,
            deleted = null
        } = req.body;

        if (!req.body.nickname && !req.body.avatar && !req.body.share_qty && !req.body.deleted) {
            return res.status(400).json({
                error: `Request body must contain one of 'nickname', 'avatar, 'share_qty', or 'deleted'`
            })
        }
     
        const splitterToUpdate = {
            nickname,
            avatar,
            share_qty,
            deleted
        };

        SplitterService.hasSplitterWithId(
            req.app.get('db'),
            splitter_id
        )
            .then(hasSplitterWithId => {
                if (!hasSplitterWithId) {
                    return res
                        .status(400)
                        .json({
                            error: `Splitter with this id does not exist`
                        })
                }

                return SplitterService.updateSplitter(
                    req.app.get('db'),
                    splitter_id,
                    splitterToUpdate
                )
                    .then(splitter => {
                        console.log(splitter)
                        res
                            .status(200)
                            .json(SplitterService.serializeSplitter(splitter))
                    })
                    .catch(next)
            })
    })

module.exports = splitterRouter;