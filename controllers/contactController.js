const ContactMessage = require('../models/ContactMessage');

// @desc    Submit new contact form (Public)
exports.submitContact = async (req, res, next) => {
  try {
    const contact = await ContactMessage.create(req.body);
    res.status(201).json({ success: true, data: contact });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact messages (Admin Only)
exports.getMessages = async (req, res, next) => {
  try {
    const messages = await ContactMessage.find().sort('-createdAt');
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a message (Admin Only)
exports.deleteMessage = async (req, res, next) => {
    try {
      await ContactMessage.findByIdAndDelete(req.params.id);
      res.status(200).json({ success: true, message: 'Message deleted' });
    } catch (error) {
      next(error);
    }
};