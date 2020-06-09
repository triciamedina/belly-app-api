const xss = require('xss');

const SplitterService = {
    hasSplitterWithId(db, id) {
        return db('belly_splitter')
            .where({ id })
            .first()
            .then(splitter => !!splitter)
    },
    hasItemSplitter(db, splitterId, itemId) {
        return db('belly_item_splitter')
            .where({ 
                splitter_id: splitterId,
                item_id: itemId
            })
            .first()
            .then(split => !!split)
    },
    getSplitterById(db, id) {
        return db
            .from('belly_splitter')
            .where({ id })
            .first()
            .select(
                'belly_splitter.id',
                'belly_splitter.nickname',
                'belly_splitter.avatar',
                'belly_splitter.created_at'
            )
            .then(splitter => splitter)
    },
    getSplitByIds(db, splitterId, itemId) {
        return db
            .from('belly_item_splitter')
            .where({ splitter_id: splitterId, item_id: itemId })
            .first()
            .select(
                'belly_item_splitter.splitter_id',
                'belly_item_splitter.item_id',
                'belly_item_splitter.share_qty',
                'belly_item_splitter.created_at'
            )
            .then(split => split)
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
    insertItemSplitter(db, newSplit) {
        return db
            .insert(newSplit)
            .into('belly_item_splitter')
            .returning('*')
            .then(([split]) => split)
            .then(split =>
                SplitterService.getSplitByIds(db, split.splitter_id, split.item_id)
            )
    },
    updateSplitter(db, id, splitterToUpdate) {
        return db
            .from('belly_splitter')
            .where({ id })
            .update(splitterToUpdate, ['id'])
            .then(([splitter]) => splitter)
            .then(splitter =>
                SplitterService.getSplitterById(db, splitter.id)
            )
    },
    updateSplit(db, splitterId, itemId, splitToUpdate) {
        return db('belly_item_splitter')
            .where({ 
                splitter_id: splitterId,
                item_id: itemId
            })
            .update(splitToUpdate, ['splitter_id', 'item_id'])
            .then(([split]) => split)
            .then(split =>
                SplitterService.getSplitByIds(db, split.splitter_id, split.item_id)
            )
    },
    serializeSplitter(splitter) {
        return {
            id: splitter.id,
            nickname: xss(splitter.nickname),
            avatar: xss(splitter.avatar),
            created_at: new Date(splitter.created_at)
        }
    },
    serializeSplit(split) {
        return {
            splitter_id: split.splitter_id,
            item_id: split.item_id,
            share_qty: split.share_qty,
            created_at: new Date(split.created_at)
        }
    },
}

module.exports = SplitterService;