const xss = require('xss');

const SplitterService = {
    getSplitterById(db, id) {
        return db
            .from('belly_splitter')
            .where({ id })
            .first()
            .select(
                'belly_splitter.id',
                'belly_splitter.item_id',
                'belly_splitter.nickname',
                'belly_splitter.avatar',
                'belly_splitter.share_qty',
                'belly_splitter.created_at'
            )
            .then(splitter => splitter)
    },
    insertSplitter(db, newSplitter) {
        return db
            .insert(newSplitter)
            .into('belly_splitter')
            .returning('*')
            .then(([splitter]) => splitter)
            .then(splitter =>
                SplitterService.getSplitterById(db, splitter.id)
            )
    },
    serializeSplitter(splitter) {
        return {
            id: splitter.id,
            item_id: splitter.item_id,
            nickname: xss(splitter.nickname),
            avatar: xss(splitter.avatar),
            share_qty: splitter.share_qty,
            created_at: new Date(splitter.created_at)
        }
    },
}

module.exports = SplitterService;