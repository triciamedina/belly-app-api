const knex = require('knex');
const app = require('./app');
const server = require('./ws/ws');
const { PORT, DATABASE_URL } = require('./config');

const db = knex({
    client: 'pg',
    connection: DATABASE_URL
});

app.set('db', db);

// app.listen(PORT, () => {
//     console.info(`Http listening at http://localhost:${PORT}`);
// });

server.on('request', app);

server.listen(PORT, () => {
    console.info(`Server listening at http://localhost:${PORT}`);
});

