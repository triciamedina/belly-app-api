const express = require('express');
const path = require('path');
const  { requireAuth } = require('../middleware/jwt-auth');

const billRouter = express.Router();
const bodyParser = express.json();
const BillService = require('../bill/bill-service');

const requireType = (req, res, next) => {
    const { type } = req.params;

    if (!req.params.type) {
        return res
            .status(400)
            .json({
                error: `Missing 'type' in request parameters`
            })
    }

    if (type !== 'owned' && type !== 'shared') {
        return res
            .status(400)
            .json({
                error: `Type parameter must be one of 'owned' or 'shared'`
            })
    }
    next();
}

billRouter
    .route(['/', '/:type'])
    .all(bodyParser)
    .all(requireAuth)
    .get(requireType, (req, res, next) => {
        const { type } = req.params;
        const { id } = req.user;

        // if owned
        if (type === 'owned') {
            BillService.getOwnedBills(
                req.app.get('db'),
                id
            )
                .then(bills => {
                    res
                        .status(200)
                        .json({ ownedByMe: bills })
                })
        }
            
        // if shared
        if (type === 'shared') {
            BillService.getSharedBills(
                req.app.get('db'),
                id
            )
                .then(bills => {
                    res
                        .status(200)
                        .json({ sharedWithMe: bills })
                })
        }
    })
    .post((req, res, next) => {

    });

module.exports = billRouter;