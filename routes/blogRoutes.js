// routes/blogRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllPublicPosts,
  getPublicPostBySlug,
  getAllAdminPosts,
  getAdminPostById,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/blogController');
const { protect, authorize } = require('../middleware/authMiddleware');

// --- PUBLIC ROUTES ---
router.get('/', getAllPublicPosts);

// --- ADMIN ROUTES ---
const adminOnly = [protect, authorize('admin')];

router.get('/admin/all', adminOnly, getAllAdminPosts);
router.post('/admin', adminOnly, createPost); // Removed upload.single('featuredImage')
router.get('/admin/:id', adminOnly, getAdminPostById);
router.put('/admin/:id', adminOnly, updatePost); // Remove upload middleware here too if needed
router.delete('/admin/:id', adminOnly, deletePost);

// --- DYNAMIC PUBLIC SLUG ROUTE ---
router.get('/:slug', getPublicPostBySlug);

module.exports = router;