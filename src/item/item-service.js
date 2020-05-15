const xss = require('xss');

const ItemService = { 
    getItemById(db, id) {
        return db
            .from('belly_item')
            .where({ id })
            .first()
            .select(
                'belly_item.id',
                'belly_item.bill_id',
                'belly_item.item_name',
                'belly_item.quantity',
                'belly_item.price',
                'belly_item.created_at'
            )
            .then(item => item)
    },
    insertItem(db, newItem) {
        return db
            .insert(newItem)
            .into('belly_item')
            .returning('*')
            .then(([item]) => item)
            .then(item =>
                ItemService.getItemById(db, item.id)
            )
    },
    serializeItemDetail(item) {
        return {
            id: item.id,
            bill_id: item.bill_id,
            item_name: xss(item.item_name),
            quantity: item.quantity,
            price: xss(item.price),
            created_at: new Date(item.created_at)
        }
    }
};

module.exports = ItemService;