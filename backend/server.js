const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
require('dotenv').config();

const Message = require('./models/Message');
const User = require('./models/User');
const userRoutes = require('./routes/userRoutes');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// REST API Routes
app.use('/api/users', userRoutes);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3001', // Your frontend address
    methods: ['GET', 'POST']
  }
});

// Keep track of online users
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('⚡ Client connected:', socket.id);

  // Client joins their personal room using UID
  socket.on('join', (userId) => {
    socket.join(userId);
    onlineUsers.set(userId, socket.id);
    console.log(`✅ ${userId} joined their room`);
  });

  // Send private message
  socket.on('send-message', async ({ sender, recipient, content }) => {
    try {
      const message = new Message({ sender, recipient, content });
      await message.save();

      // Emit message to both sender and recipient's room
      io.to(sender).emit('receive-message', { sender, recipient, content });
      io.to(recipient).emit('receive-message', { sender, recipient, content });

      console.log(`💬 ${sender} → ${recipient}: ${content}`);
    } catch (err) {
      console.error('❌ Error sending message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('🚪 Client disconnected:', socket.id);
    for (const [userId, sockId] of onlineUsers.entries()) {
      if (sockId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
