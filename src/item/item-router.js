const express = require('express');
const path = require('path');
const  { requireAuth } = require('../middleware/jwt-auth');
const ItemService = require('./item-service');

const itemRouter = express.Router();
const bodyParser = express.json();

itemRouter
    .route('/')
    .all(requireAuth)
    .post(bodyParser, (req, res, next) => {
        const { itemName, quantity, price, bill_id } = req.body;

        for (const field of ['itemName', 'quantity', 'price', 'bill_id']) {
            if (req.body[field] == null) {
                return res.status(400).json({
                    error: `Missing '${field}' in request body`
                })
            }
        };

        const newItem = {
            item_name: itemName,
            bill_id,
            quantity,
            price
        };

        ItemService.insertItem(
            req.app.get('db'),
            newItem
        )
            .then(item => {
                return res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${item.id}`))
                    .json(ItemService.serializeItemDetail(item))
            })
            .catch(next)
    })

itemRouter
    .route('/:item_id')
    .all(requireAuth)
    .get((req, res, next) => {
        const { item_id } = req.params;

        ItemService.hasItemWithId(
            req.app.get('db'),
            item_id
        )
            .then(hasItemWithId => {
                if (!hasItemWithId) {
                    return res
                        .status(400)
                        .json({ 
                            error: `Item with this id does not exist` 
                        })
                };

                return ItemService.getItemById(
                    req.app.get('db'),
                    item_id
                )
                    .then(item => {
                        res
                            .status(200)
                            .json(ItemService.serializeItemDetail(item))
                    })
                    .catch(next)
            })
    })
    .patch(bodyParser, (req, res, next) => {
        const { item_id } = req.params;

        const { itemName = undefined, quantity = undefined, price = undefined } = req.body;

        if (!req.body[itemName] && !req.body[quantity] && !req.body[price]) {
            return res.status(400).json({
                error: `Request body must contain one of 'itemName', 'price', or 'quantity'`
            })
        }
     
        const itemToUpdate = {
            item_name: itemName,
            quantity,
            price
        }

        ItemService.hasItemWithId(
            req.app.get('db'),
            item_id
        )
            .then(hasItemwithId => {
                if (!hasItemwithId) {
                    return res
                        .status(400)
                        .json({
                            error: `Item with this id does not exist`
                        })
                }

                return ItemService.updateItem(
                    req.app.get('db'),
                    item_id,
                    itemToUpdate
                )
                    .then(item => {
                        res
                            .status(200)
                            .json(ItemService.serializeItemDetail(item))
                    })
                    .catch(next)
            })
    })

module.exports = itemRouter;