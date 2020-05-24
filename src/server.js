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

// websocket.listen('polar-wildwood-68922.herokuapp.com', PORT, (listenSocket) => {
//     if (listenSocket) {
//         console.info(`Websocket listening to port ${PORT}`);
//     }
// })



app.listen(PORT, () => {
    console.info(`Http listening at http://localhost:${PORT}`);
});

const wss = new Server({ server: app });

wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.on('close', () => console.log('Client disconnected'));
  });
  
  setInterval(() => {
    wss.clients.forEach((client) => {
      client.send(new Date().toTimeString());
    });
  }, 1000);