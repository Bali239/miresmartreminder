const { Schema, model } = require('mongoose');

module.exports = model('User', new Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  timezone: { type: String, default: 'UTC' },
}));