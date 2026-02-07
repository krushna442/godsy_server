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
const upload = require('../middleware/uploadMiddleware');

// --- PUBLIC ROUTES ---
// Handles GET /api/blog/
router.get('/', getAllPublicPosts);

// --- ADMIN ROUTES (MUST COME BEFORE THE DYNAMIC /:slug ROUTE) ---
const adminOnly = [protect, authorize('admin')];

// Handles GET /api/blog/admin/all
router.get('/admin/all', adminOnly, getAllAdminPosts);

// Handles POST /api/blog/admin
router.post('/admin', adminOnly, upload.single('featuredImage'), createPost);

// Handles routes for a specific post by ID for admins
router.get('/admin/:id', adminOnly, getAdminPostById);
router.put('/admin/:id', adminOnly, upload.single('featuredImage'), updatePost);
router.delete('/admin/:id', adminOnly, deletePost);

// --- DYNAMIC PUBLIC SLUG ROUTE (MUST BE LAST) ---
// This will match anything that wasn't caught by the specific routes above.
// e.g., /api/blog/my-first-post
router.get('/:slug', getPublicPostBySlug);

module.exports = router;