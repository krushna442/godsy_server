const BlogPost = require('../models/blogPost');
const { cloudinary } = require('../config/cloudinary'); // Import our cloudinary config

// --- PUBLIC CONTROLLERS ---

// @desc    Get all published posts
// @route   GET /api/blog
exports.getAllPublicPosts = async (req, res, next) => {
  try {
    const posts = await BlogPost.find({ status: 'published' })
      .populate('author', 'username')
      .sort('-publishedAt');

    res.status(200).json({ success: true, count: posts.length, data: posts });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single post by slug & increment views
// @route   GET /api/blog/:slug
exports.getPublicPostBySlug = async (req, res, next) => {
  try {
    const post = await BlogPost.findOneAndUpdate(
      { slug: req.params.slug, status: 'published' },
      { $inc: { views: 1 } },
      { new: true }
    ).populate('author', 'username');

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

// --- ADMIN CONTROLLERS ---

// @desc    Get all posts for admin
// @route   GET /api/blog/admin/all
exports.getAllAdminPosts = async (req, res, next) => {
  try {
    const posts = await BlogPost.find()
      .populate('author', 'username')
      .sort('-createdAt');
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new post
// @route   POST /api/blog/admin
exports.createPost = async (req, res, next) => {
  try {
    const { title, content, category, tags, status } = req.body;

    // Cloudinary returns the URL in 'path' and the ID in 'filename'
    const imageUrl = req.file ? req.file.path : null;
    const imageId = req.file ? req.file.filename : null;

    const post = await BlogPost.create({
      title,
      content,
      category,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      featuredImage: imageUrl,
      featuredImagePublicId: imageId,
      author: req.user._id, 
      status: status || 'draft'
    });

    res.status(201).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

// @desc    Update post & handle Cloudinary replacement
// @route   PUT /api/blog/admin/:id
exports.updatePost = async (req, res, next) => {
  try {
    let post = await BlogPost.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    const updateData = { ...req.body };
    
    if (updateData.tags) {
      updateData.tags = updateData.tags.split(',').map(tag => tag.trim());
    }

    // ADVANCED: If a new image is uploaded, delete the old one from Cloudinary
    if (req.file) {
      if (post.featuredImagePublicId) {
        await cloudinary.uploader.destroy(post.featuredImagePublicId);
      }
      updateData.featuredImage = req.file.path;
      updateData.featuredImagePublicId = req.file.filename;
    }

    post = await BlogPost.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete post & remove from Cloudinary
// @route   DELETE /api/blog/admin/:id
exports.deletePost = async (req, res, next) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    // ADVANCED: Cleanup Cloudinary storage
    if (post.featuredImagePublicId) {
      await cloudinary.uploader.destroy(post.featuredImagePublicId);
    }

    await post.deleteOne();

    res.status(200).json({ success: true, message: 'Post and cloud image removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin post by ID (for edit form)
exports.getAdminPostById = async (req, res, next) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};