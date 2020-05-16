const xss = require('xss');

const ViewService = {
    getViewById(db, id) {
        return db
            .from('belly_bill_views')
            .where({ id })
            .first()
            .select(
                'belly_bill_views.id',
                'belly_bill_views.bill_id',
                'belly_bill_views.user_id',
                'belly_bill_views.last_viewed'
            )
            .then(view => view)
    },
    insertView(db, newView) {
        return db
            .insert(newView)
            .into('belly_bill_views')
            .returning('*')
            .then(([view]) => view)
            .then(view =>
                ViewService.getViewById(db, view.id)
            )
    },
    serializeView(view) {
        return {
            id: view.id,
            bill_id: view.item_id,
            user_id: view.user_id,
            last_viewed: new Date(view.last_viewed)
        }
    },
}

module.exports = ViewService;