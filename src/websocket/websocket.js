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
        idleTimeout: 0,
        message: (ws, message, _) => {
            const activity = JSON.parse(WebSocketService.ab2str(message));
            const billId = activity.billId;

            console.log('message received', activity)

            if (activity.newUser) {
                const id = WebSocketService.getUniqueID();

                if (!clients[billId]) {
                    clients[billId] = {}
                }

                const username = activity.newUser.nickname;
                clients[billId][username] = activity.newUser;

                ws.send(JSON.stringify({ viewerJoined: true, id: id }));

                ws.publish(`bill/${billId}/users`, JSON.stringify({ updateViewers: true, clients: clients[billId] }));
                console.log(clients)
            }

            if (activity.userExit) {
                const username = activity.userExit;
                delete clients[billId][username];
            
                ws.publish(`bill/${billId}/users`, JSON.stringify({ updateViewers: true, clients: clients[billId] }));
                ws.send(JSON.stringify({ viewerExited: true })); 

                console.log(clients)
            }

            if (activity.billUpdate) {
                const billId = activity.billUpdate;

                ws.publish(`bill/${billId}/update`, JSON.stringify({ updateBill: true }))
            }
        },
        close: (ws, code, message) => {
            console.log(code, WebSocketService.ab2str(message))
        }
    })
    .any('/*', (res, _) => { 
        res.end('No http');
    })
