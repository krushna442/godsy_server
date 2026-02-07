// server/models/BlogPost.js
const mongoose = require('mongoose');
const slugify = require('slugify');

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A blog must have a title'],
    trim: true,
    maxlength: [150, 'Title cannot exceed 150 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  content: {
    type: String,
    required: [true, 'Blog content is required']
  },
  excerpt: {
    type: String,
    maxlength: [500, 'Excerpt cannot exceed 500 characters']
  },
  featuredImage: {
    type: String, 
    default: null
  },
  featuredImagePublicId: {
    type: String,
    default: null
  },
  category: {
    type: String,
    required: [true, 'Please specify a category'],
    // REMOVED: The 'enum' list to allow any category name like "Web Developments"
    default: 'General'
  },
  tags: {
    type: [String],
    default: []
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A blog must belong to an author']
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  views: {
    type: Number,
    default: 0
  },
  publishedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// --- FIXED MIDDLEWARE: Removed 'next' to prevent the TypeError ---
blogPostSchema.pre('save', async function() {
  // 1. Generate Slug
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  // 2. Generate Excerpt if empty
  if (!this.excerpt && this.content) {
    this.excerpt = this.content
      .replace(/<[^>]*>?/gm, '') 
      .substring(0, 200) + '...';
  }

  // 3. Set publishedAt date
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = Date.now();
  }
  
  // No next() needed here for async functions
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);
module.exports = BlogPost;