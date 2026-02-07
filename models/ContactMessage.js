const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  company: { type: String, trim: true },
  service: { type: String, required: true },
  budget: { type: String },
  message: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['unread', 'read', 'replied', 'archived'], 
    default: 'unread' 
  }
}, { timestamps: true });

module.exports = mongoose.model('ContactMessage', contactMessageSchema);