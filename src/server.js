const knex = require('knex');
const app = require('./app');
const server = require('http').createServer();
const { PORT, DATABASE_URL } = require('./config');

const db = knex({
    client: 'pg',
    connection: DATABASE_URL
});

app.set('db', db);

// app.listen(PORT, () => {
//     console.info(`Http listening at http://localhost:${PORT}`);
// });

// const wss = new Server({ server: server });

server.on('request', app);

// wss.on('connection', (ws) => {
//     console.log('Client connected');
//     ws.on('close', () => console.log('Client disconnected'));
//   });
  
//   setInterval(() => {
//     wss.clients.forEach((client) => {
//       client.send(new Date().toTimeString());
//     });
//   }, 1000);

server.listen(PORT, () => {
    console.info(`Server listening at http://localhost:${PORT}`);
});