const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true }, // Firebase UID
  displayName: String,
  email: String,
});

module.exports = mongoose.model('User', userSchema);
