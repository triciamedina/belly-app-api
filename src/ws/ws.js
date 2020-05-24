const server = require('../server');
const { Server } = require('ws');
const wss = new Server({ server: server });

wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.on('close', () => console.log('Client disconnected'));
  });