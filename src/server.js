const knex = require('knex');
const app = require('./app');
// const websocket = require('./websocket/websocket');
const { Server } = require('ws');
const { PORT, WS_PORT, DATABASE_URL } = require('./config');

const db = knex({
    client: 'pg',
    connection: DATABASE_URL
});

app.set('db', db);
// app.set('ws', websocket);

const wss = new Server({ app });

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('close', () => console.log('Client disconnected'));
});

setInterval(() => {
  wss.clients.forEach((client) => {
    client.send(new Date().toTimeString());
  });
}, 1000);

// websocket.listen(WS_PORT, (listenSocket) => {
//     if (listenSocket) {
//         console.info(`Websocket listening to port ${WS_PORT}`);
//     }
// })

app.listen(PORT, () => {
    console.info(`Http listening at http://localhost:${PORT}`);
});

// const express = require('express');


// const PORT = process.env.PORT || 3000;
// const INDEX = '/index.html';

// const server = express()
//   .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
//   .listen(PORT, () => console.log(`Listening on ${PORT}`));



