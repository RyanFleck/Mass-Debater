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

const User = require('./src/user');

const rooms = {};

app.use(bodyParser.json());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('static/client_resources'));

app.get('/', (req, res) => {
    res.sendFile(path.join( __dirname + '/static/index.html'));
});

app.get('/:room', (req, res) => {
    res.sendFile(path.join( __dirname + '/static/chatroom.html'));
});


/**
 * SocketIO calls.
 */

io.on('connection', (socket)=>{

    const user = new User(socket.id);


    socket.on('get-page-info',(pageurl)=>{
        const { roomid, fancyname } = parseUrl(pageurl);
        io.to(socket.id).emit('room-setup', {}, fancyname, roomid);
        user.setRoom(roomid, fancyname);


        if (!io.nsps['/'].adapter.rooms[roomid]) {
            socket.emit('message', 'You are first!');
        } else { 
            socket.emit('message', `${io.nsps['/'].adapter.rooms[roomid].length} other users present in ${roomid}`);
        }

        socket.join(roomid);
        console.log(`User ${socket.id} joined room ${user.getRoom()}`);
    });

    socket.on('message-from-user', (x) => {
        if (!x.message || !x.username || !x.room )
            return 1;

        socket.emit('message', 'Client recieved message '+x.message);
        console.log('Circulating message to' + x.room);
        socket.to(user.getRoom()).emit('message-to-room', {
            'username': x.username.substr(0,20),
            'message': x.message.substr(0, 240)
        });
    });

    socket.on('disconnect', () => { 
        console.log(`User ${socket.id} left room ${user.getRoom()}`);
    });
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

function parseUrl(url){
    url = decodeURI(url.substr(1));
    const roomid = url.replace(/[^0-9a-z]/gi, '').toLowerCase();
    return { 'roomid': roomid, 'fancyname': url };
}

module.exports = app;
