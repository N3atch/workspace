const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const vacationRoutes = require('./routes/vacations');
const followRoutes = require('./routes/follows');
const uploadRoutes = require('./routes/upload');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use('/upload', express.static(path.join(__dirname, '../upload')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vacations', vacationRoutes);
app.use('/api/follows', followRoutes);
app.use('/api/upload', uploadRoutes);

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Make io available to routes
app.set('io', io);

// Global function to emit vacation updates
global.emitVacationUpdate = (vacation) => {
    io.emit('vacationUpdated', vacation);
};

global.emitVacationDeleted = (vacationId) => {
    io.emit('vacationDeleted', vacationId);
};

global.emitVacationCreated = (vacation) => {
    io.emit('vacationCreated', vacation);
};

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = { app, io };

