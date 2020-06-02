const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const {addUser, removeUser, getUser, getUsersInRoom} = require('./users.js');

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);
server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
const room = '100'

io.on('connection', (socket) => {
    console.log('We have a new connection!!!');
    socket.on('join', ({name, room}, callback) => {
        const user = addUser({id: socket.id, name});
        room = '100';
        socket.join(room);
        callback();
    });
    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
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