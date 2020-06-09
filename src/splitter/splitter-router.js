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

        const { nickname, avatar } = req.body;

        for (const field of ['nickname', 'avatar']) {
            if (req.body[field] == null) {
                return res.status(400).json({
                    message: `Missing '${field}' in request body`
                });
            };
        };

        const newSplitter = {
            nickname,
            avatar
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

        const { splitter_id } = req.params;

        const { 
            nickname = undefined,
            avatar = undefined,
            deleted = null
        } = req.body;

        if (!req.body.nickname && !req.body.avatar && !req.body.deleted) {
            return res.status(400).json({
                message: `Request body must contain one of 'nickname', 'avatar, or 'deleted'`
            });
        };
     
        const splitterToUpdate = {
            nickname,
            avatar,
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
                            message: `Splitter with this id does not exist`
                        })
                };

                return SplitterService.updateSplitter(
                    req.app.get('db'),
                    splitter_id,
                    splitterToUpdate
                )
                    .then(splitter => {
                        res
                            .status(200)
                            .json(SplitterService.serializeSplitter(splitter))
                    })
                    .catch(next)
            })
    })

splitterRouter
    .route('/:splitter_id/:item_id')
    .all(requireAuth)
    .all(bodyParser)
    .post((req, res, next) => {
        
        const { splitter_id, item_id } = req.params;
        const {  share_qty } = req.body;

        if (!req.body.share_qty) {
            return res.status(400).json({
                message: `Request body must contain 'share_qty'`
            });
        };
     
        const newSplit = {
            splitter_id,
            item_id,
            share_qty
        };

        SplitterService.hasItemSplitter(
            req.app.get('db'),
            splitter_id,
            item_id
        )
            .then(hasSplitterWithId => {

                // If splitter/item relation existed before and was marked as deleted
                if (hasSplitterWithId) {

                    // Unmark as deleted
                    newSplit.deleted = null;

                    return SplitterService.updateSplit(
                        req.app.get('db'),
                        splitter_id,
                        item_id,
                        newSplit
                    )
                        .then(split => {
                            res
                                .status(200)
                                .json(SplitterService.serializeSplit(split))
                        })
                        .catch(next)
                };

                // Otherwise add new split
                SplitterService.insertItemSplitter(
                    req.app.get('db'),
                    newSplit
                )
                    .then(split => {
                        return res
                            .status(201)
                            .location(path.posix.join(req.originalUrl, `/${split.splitter_id}`))
                            .json(SplitterService.serializeSplit(split))
                    })
                    .catch(next)
            })
    })
    .patch((req, res, next) => {

        const { splitter_id, item_id } = req.params;
        const {  share_qty = undefined, deleted = null } = req.body;

        if (!req.body.share_qty && !req.body.deleted) {
            return res.status(400).json({
                message: `Request body must contain one of 'share_qty' or 'deleted'`
            })
        };
     
        const splitToUpdate = {
            share_qty,
            deleted
        };

        SplitterService.hasItemSplitter(
            req.app.get('db'),
            splitter_id,
            item_id
        )
            .then(hasSplitterWithId => {
                if (!hasSplitterWithId) {
                    return res
                        .status(400)
                        .json({
                            message: `Splitter for this item does not exist`
                        })
                }

                return SplitterService.updateSplit(
                    req.app.get('db'),
                    splitter_id,
                    item_id,
                    splitToUpdate
                )
                    .then(split => {
                        res
                            .status(200)
                            .json(SplitterService.serializeSplit(split))
                    })
                    .catch(next)
            })
    })

module.exports = splitterRouter;