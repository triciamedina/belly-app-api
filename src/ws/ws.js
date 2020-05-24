const server = require('http').createServer();
const { Server } = require('ws');
const wss = new Server({ server: server });
const WebSocketService = require('../websocket/websocket-service');

const clients = {};

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', function incoming(message) {
      const activity = JSON.parse(message);
      const billId = activity.billId;

      console.log('received: ', message);

      if (activity.newUser) {
        console.log('new user entered')

        const id = WebSocketService.getUniqueID();
        ws.room = billId;

        if (!clients[billId]) {
            clients[billId] = {}
        }

        const username = activity.newUser.nickname;
        clients[billId][username] = activity.newUser;

        ws.send(JSON.stringify({ viewerJoined: true, id: id }));

        wss.clients.forEach((client) => {
          if (client.room === billId) {
            client.send(JSON.stringify({ updateViewers: true, clients: clients[billId] }));
          }
        });

        // ws.publish(`bill/${billId}/users`, JSON.stringify({ updateViewers: true, clients: clients[billId] }));
        // console.log(clients)
      }

      if (activity.userExit) {
        const username = activity.userExit;
        console.log(`${username} exited`)
        delete clients[billId][username];
    
        // ws.publish(`bill/${billId}/users`, JSON.stringify({ updateViewers: true, clients: clients[billId] }));
        ws.send(JSON.stringify({ viewerExited: true })); 

        // console.log(clients)
    }
    });
    
    ws.on('close', () => console.log('Client disconnected'));
  });

module.exports = server;