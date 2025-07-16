const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  senderId: { type: String, required: true },       // email or user ID
  recipientId: { type: String, required: true },    // email or user ID
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', MessageSchema);
