const knex = require('knex');
const app = require('./app');

const { PORT, DATABASE_URL } = require('./config');

const db = knex({
    client: 'pg',
    connection: DATABASE_URL
});

app.set('db', db);
app.set('ws', websocket);

// const app = require('../app');
// const server = require('http').createServer(app);
const websocket = require('./websocket/websocket').listen(app);
// const uWS = require('uWebSockets.js').listen(server);

// websocket.listen(PORT, (listenSocket) => {
//     if (listenSocket) {
//         console.info(`Websocket listening to port ${PORT}`);
//     }
// })

app.listen(PORT, () => {
    console.info(`Http listening at http://localhost:${PORT}`);
});