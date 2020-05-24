const knex = require('knex');
const app = require('./app');
const websocket = require('./websocket/websocket');
const { PORT, WS_PORT, DATABASE_URL } = require('./config');

const db = knex({
    client: 'pg',
    connection: DATABASE_URL
});

app.set('db', db);
app.set('ws', websocket);

websocket.listen(PORT, (listenSocket) => {
    if (listenSocket) {
        console.info(`Websocket listening to port ${PORT}`);
    }
})

app.listen(PORT, () => {
    console.info(`Http listening at http://localhost:${PORT}`);
});