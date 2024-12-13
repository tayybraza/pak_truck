// index.js
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const cors = require('cors');
const http = require('http');
const socketio = require('socket.io');
require('dotenv').config({ path: './config/.env' });
const errorHandler = require('./middleware/error');
const logger = require('./utils/logger');
const cookieParser = require('cookie-parser');
const cron = require('node-cron');
const path = require('path');

// Chat Routes
// const chatRoutes = require('./routes/chatRoutes');

// Other Routes
// const roleRoutes = require('./routes/roleRoutes');
// const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
// const courseRoutes = require('./routes/courseRoutes');
// const studentRoutes = require('./routes/studentRoutes');
// const installmentRoutes = require('./routes/installmentRoutes');
// const taskRoutes = require('./routes/taskRoutes');
// const attendanceRoutes = require('./routes/attendanceRoutes');
// const progressNoteRoutes = require('./routes/progressNoteRoutes');
// const studentReportRoutes = require('./routes/studentReportRoutes');
// const notificationRoutes = require('./routes/notificationRoutes');
// const groupRoutes = require('./routes/group');
// const onlineClasses = require('./routes/onlineClasses');

// Load env vars
dotenv.config({ path: './config/.env' });

// Debug environment variables
// console.log('MONGO_URL:', process.env.MONGO_URL);
// console.log('PORT:', process.env.PORT);
// console.log('NODE_ENV:', process.env.NODE_ENV);
// console.log('JWT_SECRET:', process.env.JWT_SECRET);
// console.log('JWT_EXPIRE:', process.env.JWT_EXPIRE);

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Enable CORS
app.use(cors({ origin: '*' }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cookieParser());

// Mount routers
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/roles', roleRoutes);
// app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
// app.use('/api/courses', courseRoutes);
// app.use('/api/students', studentRoutes);
// app.use('/api/installments', installmentRoutes);
// app.use('/api/tasks', taskRoutes);
// app.use('/api/attendance', attendanceRoutes);
// app.use('/api/progress-notes', progressNoteRoutes);
// app.use('/api/studentReports', studentReportRoutes);
// app.use('/api/notifications', notificationRoutes);
// app.use('/api/groups', groupRoutes);
// app.use('/api/online-classes', onlineClasses);
// app.use('/api/chats', chatRoutes); // Chat Routes

// Welcome API
app.get('/', (req, res) => {
    res.send("Welcome to Pakistani Truck System!");
});

// Error handler
app.use(errorHandler);

// Socket.io Configuration
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
    });

    socket.on('chatMessage', async ({ sender, receiver, message }) => {
        try {
            const Chat = require('./models/Chat');
            const newChat = await Chat.create({ sender, receiver, message });

            io.to(receiver).emit('message', newChat);
            io.to(sender).emit('message', newChat);
        } catch (error) {
            console.error('Error saving chat message:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

// Error handling middleware at the end
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || 'Server Error'
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger.error(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});