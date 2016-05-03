'use strict';
const config = require('../config');

let Message = require('../models/message').Message;

module.exports = function(server) {
    let io = require('socket.io')(server, {
        origins: config.get('origins')
    });

    io.use(require('./socketAuth'));

    io.on('connection', function(socket) {
        let connectedUsers = getConnectedUsers(this.connected);

        socket.on('Who is online?', function (p, cb) {
            cb(connectedUsers);
        });

        if (socket.handshake.user) {
            let username = socket.handshake.user.get('username');
            socket.broadcast.emit('join', username);

            socket.on('message', function(text, cb) {
                let date = Date.now();

                Message.saveMessage(username, text, date, function (err, message) {
                    if (err) {
                        socket.server.emit('error saving message', err);
                    } else {
                        socket.server.emit('message', message);
                        cb && cb();
                    }
                });
            });

            socket.on('disconnect', function() {
                socket.broadcast.emit('leave', username);
            });
        }
    });

    io.sessionReload = function(sid) {
        let clients = this.sockets.connected;

        for (let key in clients) {
            if (clients[key].handshake.session.id === sid) {
                clients[key].emit('change user status');
            }
        }
    };

    return io;
};

function getConnectedUsers(connectedSockets) {
    let listOfUserNames = [];

    for (let key in connectedSockets) {
        if (connectedSockets[key].handshake.user) {
            listOfUserNames.push(connectedSockets[key].handshake.user.get('username'));
        }
    }
    return listOfUserNames;
}