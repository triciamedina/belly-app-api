const xss = require('xss');

const BillService = {  
    getOwnedBills(db, user_id) {
        return db
            .from('belly_bill')
            .where('owner', user_id)
            .select(
                'belly_bill.id',
                'belly_bill.owner',
                'belly_bill.created_at',
                'belly_bill.bill_name',
                'belly_bill.bill_thumbnail',
                'belly_bill.last_viewed',
                'belly_bill.discounts',
                'belly_bill.tax',
                'belly_bill.tip',
                'belly_bill.fees',
                db.raw(
                    `ARRAY(
                       SELECT
                        JSON_BUILD_OBJECT(
                            'id', belly_item.id, 
                            'bill_id', belly_item.bill_id,
                            'item_name', belly_item.item_name,
                            'quantity', belly_item.quantity,
                            'price', belly_item.price,
                            'created_at', belly_item.created_at,
                            'split_list', ARRAY(
                                SELECT
                                JSON_BUILD_OBJECT(
                                    'id', belly_splitter.id,
                                    'item_id', belly_splitter.item_id,
                                    'nickname', belly_splitter.nickname,
                                    'avatar', belly_splitter.avatar,
                                    'share_qty', belly_splitter.share_qty,
                                    'created_at', belly_splitter.created_at
                                )
                                FROM belly_splitter
                                WHERE belly_splitter.item_id = belly_item.id
                            )
                        )
                        FROM belly_item
                        WHERE belly_item.bill_id = belly_bill.id
                    ) AS "items"`
                )
            )
            .then(bills => bills)
    },
    getSharedBills(db, user_id) {
        return db
            .from('belly_user_bill')
            .where('user_id', user_id)
            .join(
                'belly_bill',
                'belly_user_bill.bill_id',
                '=',
                'belly_bill.id'
            )
            .select(
                'belly_bill.id',
                'belly_bill.owner',
                'belly_bill.created_at',
                'belly_bill.bill_name',
                'belly_bill.bill_thumbnail',
                'belly_bill.last_viewed',
                'belly_bill.discounts',
                'belly_bill.tax',
                'belly_bill.tip',
                'belly_bill.fees',
                db.raw(
                    `ARRAY(
                       SELECT
                        JSON_BUILD_OBJECT(
                            'id', belly_item.id, 
                            'bill_id', belly_item.bill_id,
                            'item_name', belly_item.item_name,
                            'quantity', belly_item.quantity,
                            'price', belly_item.price,
                            'created_at', belly_item.created_at,
                            'split_list', ARRAY(
                                SELECT
                                JSON_BUILD_OBJECT(
                                    'id', belly_splitter.id,
                                    'item_id', belly_splitter.item_id,
                                    'nickname', belly_splitter.nickname,
                                    'avatar', belly_splitter.avatar,
                                    'share_qty', belly_splitter.share_qty,
                                    'created_at', belly_splitter.created_at
                                )
                                FROM belly_splitter
                                WHERE belly_splitter.item_id = belly_item.id
                            )
                        )
                        FROM belly_item
                        WHERE belly_item.bill_id = belly_bill.id
                    ) AS "items"`
                )
            )
            .then(bills => bills)
    },
    getItems(db, bill_id) {
        return db
            .from('belly_item')
            .select('*')
            .where('bill_id', bill_id)
            .then(items => items)
    }
}

module.exports = BillService;