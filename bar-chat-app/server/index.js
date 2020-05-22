const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const {addUser, removeUser, getUser, getUsersInRoom} = require('./users.js');

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);
server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
const room = 100

io.on('connection', (socket) => {
    console.log('We have a new connection!!!');
    socket.on('join', ({name, room}, callback) => {
        const { error, user} = addUser({id: socket.id, name});
        if(error) {
            return callback(error);
        }
        socket.emit('message', {user: 'admin', text: `${user.name}, welcome to this chat room!`});
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name}, has joined`});
        socket.join(room);
        callback();
    });
    socket.on('transmitMessage', (message, callback) => {
        io.to(room).emit('message', {user: user.name, text: message});
        callback();
    });
    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if(user) {
            io.to(room).emit('message', { user: 'admin', text: `${user.name} has left`});
        }
    })
});