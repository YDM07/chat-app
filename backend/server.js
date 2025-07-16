const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
require('dotenv').config(); // Load environment variables

const Message = require('./models/Message'); // MongoDB model

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Optional REST API to fetch recent messages
app.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 }).limit(100);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Update if frontend is hosted elsewhere
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('⚡ New client connected:', socket.id);

  // Listen for chat messages from client
  socket.on('send-message', async (data) => {
    const { content, sender } = data;

    const msg = new Message({
      content,
      senderId: sender,
    });

    try {
      await msg.save();
      console.log('💾 Message saved:', msg);
    } catch (error) {
      console.error('❌ Error saving message:', error.message);
    }

    // Broadcast to other clients
    socket.broadcast.emit('receive-message', data);
  });

  socket.on('disconnect', () => {
    console.log('🚪 Client disconnected:', socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
