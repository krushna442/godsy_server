const mongoose = require('mongoose');

const auditRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  company: { type: String },
  website: { type: String, required: true },
  phone: { type: String },
  auditType: { 
    type: String, 
    enum: ['general', 'security', 'performance', 'cloud', 'seo'],
    default: 'general' 
  },
  message: { type: String },
  status: { 
    type: String, 
    enum: ['new', 'in-progress', 'contacted', 'archived'], 
    default: 'new' 
  }
}, { timestamps: true });

module.exports = mongoose.model('AuditRequest', auditRequestSchema);