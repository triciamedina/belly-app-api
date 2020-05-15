const express = require('express');
const path = require('path');
const  { requireAuth } = require('../middleware/jwt-auth');
const BillService = require('../bill/bill-service');

const billRouter = express.Router();
const bodyParser = express.json();

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
    .route('/')
    .all(requireAuth)
    .post(bodyParser, (req, res, next) => {
        // Posting new bill to bills owned by user
    })

billRouter
    .route('/:type')
    .all(requireAuth)
    .all(requireType)
    .get((req, res, next) => {
        const { type } = req.params;
        const { id } = req.user;

        // get bills owned by user
        if (type === 'owned') {
            BillService.getOwnedBills(
                req.app.get('db'),
                id
            )
                .then(bills => {
                    return res
                        .status(200)
                        .json({ ownedByMe: bills.map(BillService.serializeBill) })
                })
                .catch(next)
        }
            
        // get bills shared with user
        if (type === 'shared') {
            BillService.getSharedBills(
                req.app.get('db'),
                id
            )
                .then(bills => {
                    return res
                        .status(200)
                        .json({ sharedWithMe: bills.map(BillService.serializeBill) })
                })
                .catch(next)
        }
    });

billRouter
    .route('/:type/:bill_id')
    .all(requireAuth)
    .all(requireType)
    .get((req, res, next) => {
        // Get details for existing bill

        const { type, bill_id } = req.params;

        if (type === 'owned') {
            BillService.hasOwnedBillWithId(
                req.app.get('db'),
                req.user.id,
                bill_id,
            )
                .then(hasBillWithId => {
                    if (!hasBillWithId) {
                        return res
                            .status(400)
                            .json({ 
                                error: `Bill with this id does not exist` 
                            })
                    };

                    return BillService.getBillById(
                        req.app.get('db'),
                        bill_id
                    )
                        .then(bill => {
                            res
                                .status(200)
                                .json({ existingBill: BillService.serializeBillDetail(bill) })
                        })
                        .catch(next)
                })
        }

        if (type === 'shared') {
            BillService.hasSharedBillWithId(
                req.app.get('db'),
                req.user.id,
                bill_id,
            )
                .then(hasBillWithId => {
                    if (!hasBillWithId) {
                        return res
                            .status(400)
                            .json({ 
                                error: `Bill with this id does not exist` 
                            })
                    };

                    return BillService.getBillById(
                        req.app.get('db'),
                        bill_id
                    )
                        .then(bill => {
                            res
                                .status(200)
                                .json({ existingBill: BillService.serializeBillDetail(bill) })
                        })
                        .catch(next)
                })
        }
    })
    .post(bodyParser, (req, res, next) => {
        // Edit details for existing bill
    })

module.exports = billRouter;