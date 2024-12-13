// socket/socket.js
const Chat = require('../models/Chat');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        // Join a specific chat room
        socket.on('joinRoom', (room) => {
            socket.join(room);
            console.log(`User joined room: ${room}`);
        });

        // Listen for chat messages
        socket.on('chatMessage', async ({ sender, receiver, message }) => {
            try {
                const newChat = await Chat.create({ sender, receiver, message });

                // Emit the message to the room
                io.to(receiver).emit('message', newChat);
                io.to(sender).emit('message', newChat);
            } catch (error) {
                console.error('Error saving chat message:', error);
            }
        });

        // Disconnect
        socket.on('disconnect', () => {
            console.log('A user disconnected:', socket.id);
        });
    });
};
