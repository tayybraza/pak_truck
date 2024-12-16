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
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// Create Express app
const app = express();

// Load env vars
dotenv.config({ path: './config/.env' });

// Connect to database
connectDB();

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

// Session and passport setup
app.use(
    session({
      secret: "secret",
      resave: false,
      saveUninitialized: true,
    })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8000/api/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Routes
const authRoutes = require('./routes/authRoutes');

// Mount routers
app.use('/api/auth', authRoutes);

// Chat routes can also go here
// app.use('/api/chats', chatRoutes);

// Welcome API
app.get('/', (req, res) => {
    res.send("Welcome to Pakistani Truck System!");
});

// Error handler
app.use(errorHandler);

// Socket.io setup
const server = http.createServer(app);
const io = socketio(server);

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
