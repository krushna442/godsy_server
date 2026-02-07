const express = require('express');
const router = express.Router();
const { submitAudit, getAudits } = require('../controllers/auditController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public can submit
router.post('/submit', submitAudit);

// Only Admins can view the list
router.get('/', protect, authorize('admin'), getAudits);

module.exports = router;