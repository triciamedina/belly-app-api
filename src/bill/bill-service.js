const xss = require('xss');

const BillService = {  
    getOwnedBills(db, user_id) {
        return db
            .from('belly_bill', 'belly_bill_views')
            .where('owner', user_id)
            .select(
                'belly_bill.id',
                'belly_bill.owner',
                'belly_bill.created_at',
                'belly_bill.bill_name',
                'belly_bill.bill_thumbnail',
                'belly_bill.discounts',
                'belly_bill.tax',
                'belly_bill.tip',
                'belly_bill.fees',
                db.raw(
                    `(
                        SELECT last_viewed
                        FROM belly_bill_views
                        WHERE belly_bill_views.bill_id = belly_bill.id
                        ORDER BY last_viewed DESC
                        LIMIT 1
                    )`
                ),
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
            .from('belly_user_bill', 'belly_bill_views')
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
                'belly_bill.discounts',
                'belly_bill.tax',
                'belly_bill.tip',
                'belly_bill.fees',
                db.raw(
                    `(
                        SELECT last_viewed
                        FROM belly_bill_views
                        WHERE belly_bill_views.bill_id = belly_bill.id
                        ORDER BY last_viewed DESC
                        LIMIT 1
                    )`
                ),
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
    serializeBill(bill) {
        return {
            id: bill.id,
            owner: bill.owner,
            created_at: new Date(bill.created_at),
            bill_name: xss(bill.bill_name),
            bill_thumbnail: xss(bill.bill_thumbnail),
            last_viewed: new Date(bill.last_viewed),
            discounts: xss(bill.discounts),
            tax: xss(bill.tax),
            tip: xss(bill.tip),
            fees: xss(bill.fees),
            items: bill.items.map(BillService.serializeItem)
        }
    },
    serializeItem(item) {
        return {
            id: item.id,
            bill_id: item.bill_id,
            item_name: xss(item.item_name),
            quantity: item.quantity,
            price: xss(item.price),
            created_at: new Date(item.created_at),
            split_list: item.split_list.map(BillService.serializeSplitter)
        }
    },
    serializeSplitter(splitter) {
        return {
            id: splitter.id,
            item_id: splitter.item_id,
            nickname: xss(splitter.nickname),
            share_qty: splitter.share_qty,
            created_at: new Date(splitter.created_at)
        }
    },
    hasOwnedBillWithId(db, user_id, bill_id) {
        return db('belly_bill')
            .where({
                owner: user_id,
                id: bill_id
            })
            .first()
            .then(bill => !!bill)
    },
    hasSharedBillWithId(db, user_id, bill_id) {
        return db('belly_user_bill')
            .where({ 
                user_id,
                bill_id
            })
            .first()
            .then(bill => !!bill)
    },
    getBillById(db, id) {
        return db
            .from('belly_bill')
            .where({ id })
            .first()
            .select(
                'belly_bill.id',
                'belly_bill.owner',
                'belly_bill.created_at',
                'belly_bill.bill_name',
                'belly_bill.bill_thumbnail',
                'belly_bill.discounts',
                'belly_bill.tax',
                'belly_bill.tip',
                'belly_bill.fees'
            )
            .then(bill => bill)
    },
    serializeBillDetail(bill) {
        return {
            id: bill.id,
            owner: bill.owner,
            created_at: new Date(bill.created_at),
            bill_name: xss(bill.bill_name),
            bill_thumbnail: xss(bill.bill_thumbnail),
            discounts: xss(bill.discounts),
            tax: xss(bill.tax),
            tip: xss(bill.tip),
            fees: xss(bill.fees)
        }
    },
    insertBill(db, newBill) {
        return db
            .insert(newBill)
            .into('belly_bill')
            .returning('*')
            .then(([bill]) => bill)
            .then(bill =>
                BillService.getBillById(db, bill.id)
            )
    },
    updateBill(db, id, billToUpdate) {
        return db
            .from('belly_bill')
            .where({ id })
            .update(billToUpdate, ['id'])
            .then(([bill]) => bill)
            .then(bill =>
                BillService.getBillById(db, bill.id)
            )
    }
}

module.exports = BillService;