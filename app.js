const express = require('express');
const socketio = require('socket.io');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const debug = require('debug')('Mass-Debater:server');
const helmet = require('helmet');

const app = express();
const srv = require('http').Server(app);
const io = socketio(srv);

app.use(bodyParser.json());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(express.static('static/client_resources'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/static/index.html'));
});

app.get('/:room', (req, res) => {
    res.send(req.params.room + ' debate room');
});

io.on('connection', (socket)=>{
    console.log('A user connected.');
});

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

/**
 * Listen on provided port, on all network interfaces.
 */

srv.listen(port);
srv.on('error', onError);
srv.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
    // named pipe
        return val;
    }

    if (port >= 0) {
    // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP srv "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
    case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
    case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
    default:
        throw error;
    }
}

/**
 * Event listener for HTTP srv "listening" event.
 */

function onListening() {
    var addr = srv.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

module.exports = app;
