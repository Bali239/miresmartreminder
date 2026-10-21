const { Schema, model } = require('mongoose');

module.exports = model('Reminder', new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: String,
  dueAt: { type: Date, required: true },       // stored in UTC
  notifyBefore: { type: Number, default: 10 }, // minutes
  remindAt: Date,                              // dueAt - notifyBefore
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  emailSent: { type: Boolean, default: false },
}, { timestamps: true }));