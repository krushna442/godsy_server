const express = require('express');
const router = express.Router();

// Dashboard stats
router.get('/dashboard-stats', async (req, res) => {
  res.json({
    users: 120,
    blogs: 34,
    audits: 12,
    messages: 8
  });
});

// Admin messages
router.get('/messages', (req, res) => {
  res.json([]);
});

module.exports = router;
