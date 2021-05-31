const knex = require('knex');
const app = require('./app');
const server = require('./ws/ws');
const { PORT, DATABASE_URL } = require('./config');
const pg = require('pg');
pg.defaults.ssl = process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false;

const db = knex({
    client: 'pg',
    connection: DATABASE_URL
});

app.set('db', db);

server.on('request', app);

server.listen(PORT, () => {
    console.info(`Server listening at http://localhost:${PORT}`);
});

