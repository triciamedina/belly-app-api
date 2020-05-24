const knex = require('knex');
const app = require('./app');

const { PORT, WS_PORT, DATABASE_URL, CLIENT_ORIGIN } = require('./config');

const db = knex({
    client: 'pg',
    connection: DATABASE_URL
});

app.set('db', db);
app.set('ws', websocket);

const server = require('http').createServer(app);
server.use(cors({
    origin: CLIENT_ORIGIN
}));

const websocket = require('./websocket/websocket').listen(server);


server.listen(PORT, () => {
    console.info(`Http listening at http://localhost:${PORT}`);
});