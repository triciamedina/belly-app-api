const xss = require('xss');

const BillService = {  
    getOwnedBills(db, user_id) {
        return db
            .from('belly_bill')
            .select('*')
            .where('owner', user_id)
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
                'belly_bill.fees'
            )
            .then(bills => bills)
    }
}

module.exports = BillService;