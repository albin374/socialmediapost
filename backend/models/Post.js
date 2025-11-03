const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    trim: true,
    maxlength: 500
  },
  image: {
    type: String,
    trim: true
  },
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: {
      type: String
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: {
      type: String
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Ensure either text or image is provided
postSchema.pre('validate', function(next) {
  if (!this.text && !this.image) {
    next(new Error('Either text or image must be provided'));
  } else {
    next();
  }
});

// Add indexes for better query performance
postSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);