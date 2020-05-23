const uWS = require('uWebSockets.js');
const app = require('../app');
const WebSocketService = require('./websocket-service');

const clients = {};

module.exports = uWS.App({})
    .ws('/*', {
        open: (ws, req) => {
            console.log('WS: Hello', req);
            ws.send('WS: Hello', false);
        }
    })
    .ws('/bill/:bill_id', {
        open: (ws, req) => {
            const billId = req.getParameter();
            console.log('WS: Viewing bill', billId);
            ws.subscribe(`bill/${billId}/#`);
        },
        message: (ws, message, _) => {
            const activity = JSON.parse(WebSocketService.ab2str(message));
            const billId = activity.billId;

            console.log('message received', activity)

            if (activity.newUser) {
                const id = WebSocketService.getUniqueID();

                if (!clients[billId]) {
                    clients[billId] = {}
                }

                clients[billId][id] = activity.newUser;

                ws.send(JSON.stringify({ viewerJoined: true, id: id }));

                ws.publish(`bill/${billId}/users`, JSON.stringify({ updateViewers: true, clients: clients[billId] }));
                console.log(clients)
            }

            if (activity.userExit) {
                const id = activity.userExit;
                delete clients[billId][id];
            
                ws.publish(`bill/${billId}/users`, JSON.stringify({ updateViewers: true, clients: clients[billId] }));
                ws.send(JSON.stringify({ viewerExited: true })); 

                console.log(clients)
            }
        },
        close: (ws, code, message) => {
            console.log(code)
        }
    })
    .any('/*', (res, _) => { 
        res.end('No http');
    })
