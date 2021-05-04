const express = require('express')
const app = express();




const http = require('http');
const server = http.Server(app);

const socketIO = require('socket.io');
const io = socketIO(server);

const port = process.env.PORT || 3000;
// const port = 3000;



io.on('connection', socket => {
    console.log('user connected');
    socket.emit('welcome');

});

server.listen(port, () => {
    console.log(`started on port: ${port}`);
});

