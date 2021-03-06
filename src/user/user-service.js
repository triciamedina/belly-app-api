const xss = require('xss');
const bcrypt = require('bcryptjs');
const REGEX_INCLUDES_NUMBER = /\d/;

const UserService = {    
    validatePassword(password) {
        if (password.length < 8) {
            return 'Password must be longer than 8 characters'
        };
        if (password.length > 36) {
            return 'Password must be less than 36 characters'
        };
        if (password.startsWith(' ') || password.endsWith(' ')) {
            return 'Password must not start or end with empty spaces'
        };
        if (!REGEX_INCLUDES_NUMBER.test(password)) {
            return 'Password must contain at least 1 number'
        };
        return null;
    },
    hasUserWithUsername(db, username) {
        return db('belly_user')
            .where({ username })
            .first()
            .then(user => !!user)
    },
    hashPassword(password) {
        return bcrypt.hash(password, 12)
    },
    insertUser(db, newUser) {
        return db
            .insert(newUser)
            .into('belly_user')
            .returning('*')
            .then(([user]) => user)
    },
    serializeUser(user) {
        return {
            id: user.id,
            username: xss(user.username),
            avatar: xss(user.avatar),
            created_at: new Date(user.created_at),
        }
    },
    getUser(db, id) {
        return db
            .from('belly_user')
            .select('*')
            .where({ id })
            .then(([user]) => user)
    },
};

module.exports = UserService;