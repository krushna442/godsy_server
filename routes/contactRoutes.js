const express = require('express');
const router = express.Router();
const { submitContact, getMessages, deleteMessage } = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/submit', submitContact);
router.get('/', protect, authorize('admin'), getMessages);
router.delete('/:id', protect, authorize('admin'), deleteMessage);

module.exports = router;