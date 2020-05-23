const express = require('express');
const path = require('path');
const  { requireAuth } = require('../middleware/jwt-auth');
const ViewService = require('./view-service');
const BillService = require('../bill/bill-service');

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

        // Check if bill is owned
        BillService.hasOwnedBillWithId(
            req.app.get('db'),
            id,
            bill_id,
        )
            .then(hasBillWithId => {
                if (!hasBillWithId) {

                    // Check if bill is shared
                    BillService.hasSharedBillWithId(
                        req.app.get('db'),
                        id,
                        bill_id,
                    )
                        .then(hasBillWithId => {
                            if (!hasBillWithId) {

                                const newShared = {
                                    user_id: id,
                                    bill_id
                                };
                                
                                // If neither, add as a shared bill
                                BillService.insertSharedBill(
                                    req.app.get('db'),
                                    newShared
                                )
                                    .then(bill => {
                                        res
                                            .status(201)
                                            .location(path.posix.join(req.originalUrl, `/${bill.id}`))
                                            .json(BillService.serializeBillDetail(bill))
                                    })
                                    .catch(next)
                            };
                        })
                        .catch(next)
                }

                // Insert new view for user
                return ViewService.insertView(
                    req.app.get('db'),
                    newView
                )
                    .then(view => {
                        res
                            .status(201)
                            .location(path.posix.join(req.originalUrl, `/${view.id}`))
                            .json(ViewService.serializeView(view))
                    })
                    .catch(next)
            })
    })

module.exports = viewRouter;