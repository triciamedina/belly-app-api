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
        
        const { id } = req.user;
        const { 
            billName, 
            billThumbnail, 
            discounts, 
            tax, 
            tip, 
            fees 
        } = req.body;

        for (const field of ['billName', 'billThumbnail', 'discounts', 'tax', 'tip', 'fees']) {
            if (req.body[field] == null) {
                return res.status(400).json({
                    error: `Missing '${field}' in request body`
                })
            }
        };
        
        const newBill = {
            owner: id,
            bill_name: billName,
            bill_thumbnail: billThumbnail,
            discounts,
            tax,
            tip,
            fees
        }

        BillService.insertBill(
            req.app.get('db'),
            newBill
        )
            .then(bill => {
                return res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${bill.id}`))
                    .json(BillService.serializeBillDetail(bill))
            })
            .catch(next)
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
        // Get details for single bill

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
    .patch(bodyParser, (req, res, next) => {
        // Edit details for existing bill
        const { type, bill_id } = req.params;

        const { 
            billName = undefined, 
            billThumbnail = undefined, 
            discounts = undefined, 
            tax = undefined, 
            tip = undefined, 
            fees = undefined
        } = req.body;

        if (
                !req.body[billName] 
                && !req.body[billThumbnail] 
                && !req.body[discounts] 
                && !req.body[tax]
                && !req.body[tip]
                && !req.body[fees]
            ) {
            return res.status(400).json({
                error: `Request body must contain one of 'billName', 'billThumbnail', 'discounts', 'tax', 'tip', or 'fees'`
            })
        }

        const billToUpdate = {
            bill_name: billName,
            bill_thumbnail: billThumbnail,
            discounts: discounts,
            tax,
            tip,
            fees
        }

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

                    return BillService.updateBill(
                        req.app.get('db'),
                        bill_id,
                        billToUpdate
                    )
                        .then(bill => {
                            res
                                .status(200)
                                .json(BillService.serializeBillDetail(bill))
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

                    return BillService.updateBill(
                        req.app.get('db'),
                        bill_id,
                        billToUpdate
                    )
                        .then(bill => {
                            res
                                .status(200)
                                .json(BillService.serializeBillDetail(bill))
                        })
                        .catch(next)
                })
        }

    });

module.exports = billRouter;