const server = require('http').createServer();
const { Server } = require('ws');
const wss = new Server({ server: server });

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', function incoming(message) {
      const activity = JSON.parse(message);
      console.log('received: ', message);

      if (activity.newUser) {
        console.log('new user entered')
        // const id = WebSocketService.getUniqueID();

        // if (!clients[billId]) {
        //     clients[billId] = {}
        // }

        // const username = activity.newUser.nickname;
        // clients[billId][username] = activity.newUser;

        // ws.send(JSON.stringify({ viewerJoined: true, id: id }));

        // ws.publish(`bill/${billId}/users`, JSON.stringify({ updateViewers: true, clients: clients[billId] }));
        // console.log(clients)
      }
    });

    ws.on('close', () => console.log('Client disconnected'));
  });

module.exports = server;