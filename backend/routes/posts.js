const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Create a post
router.post('/', auth, async (req, res) => {
  try {
    const { text, image } = req.body;
    
    const post = new Post({
      user: req.userId,
      text,
      image
    });
    
    await post.save();
    
    // Populate user info
    await post.populate('user', 'username');
    
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all posts (feed)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'username')
      .populate('comments.user', 'username')
      .sort({ createdAt: -1 });
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get posts by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId })
      .populate('user', 'username')
      .populate('comments.user', 'username')
      .sort({ createdAt: -1 });
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current user's posts
router.get('/me', auth, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.userId })
      .populate('user', 'username')
      .populate('comments.user', 'username')
      .sort({ createdAt: -1 });
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Like a post
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Get user info
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user already liked the post
    const alreadyLikedIndex = post.likes.findIndex(like => 
      like.user.toString() === req.userId
    );
    
    if (alreadyLikedIndex !== -1) {
      // Unlike the post
      post.likes.splice(alreadyLikedIndex, 1);
    } else {
      // Like the post
      post.likes.push({ 
        user: req.userId,
        username: user.username
      });
    }
    
    await post.save();
    
    // Populate user info
    await post.populate('user', 'username');
    await post.populate('comments.user', 'username');
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Comment on a post
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }
    
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Get user info
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const comment = {
      user: req.userId,
      username: user.username,
      text
    };
    
    post.comments.push(comment);
    await post.save();
    
    // Populate user info
    await post.populate('user', 'username');
    await post.populate('comments.user', 'username');
    
    res.json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;