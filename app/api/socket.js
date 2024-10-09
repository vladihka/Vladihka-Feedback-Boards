import { Server } from 'socket.io';

const io = new Server(server);

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('new-board', (board) => {
        io.emit('update-boards', board);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});