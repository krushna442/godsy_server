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
// controllers/blogController.js

exports.createPost = async (req, res, next) => {
  try {
    console.log('Creating post with data:', req.body);
    
    const { 
      title, 
      content, 
      excerpt, 
      author, 
      category, 
      tags, 
      status,
      featuredImage 
    } = req.body;

    // Check required fields
    if (!title || !content) {
      res.status(400);
      throw new Error('Title and content are required');
    }

    // Create slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    // Check if slug already exists
    const existingPost = await BlogPost.findOne({ slug });
    if (existingPost) {
      res.status(400);
      throw new Error('A post with this title already exists');
    }

    // Prepare post data
    const postData = {
      title,
      slug,
      content,
      excerpt: excerpt || content.substring(0, 150) + '...',
      author: author || req.user._id,
      category: category || 'Uncategorized',
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      status: status || 'draft',
    };

    // Handle Cloudinary image data
    if (featuredImage && featuredImage.url) {
      postData.featuredImage = {
        url: featuredImage.url,
        public_id: featuredImage.public_id || null,
        provider: 'cloudinary'
      };
    }

    console.log('Saving post with data:', postData);

    // Save to database
    const post = await Post.create(postData);

    console.log('Post created successfully:', post._id);

    res.status(201).json({
      success: true,
      data: post
    });

  } catch (error) {
    console.error('Error creating post:', error);
    next(error);
  }
};

// Update other controller functions to handle the new image structure
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