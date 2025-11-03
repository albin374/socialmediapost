import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  PhotoCamera, 
  Public, 
  Person, 
  Favorite, 
  Comment as CommentIcon,
  Add as AddIcon
} from '@mui/icons-material';
import './../customStyles.css';
import api from '../api';

const CreatePost = ({ user, onLogout }) => {
  const [postData, setPostData] = useState({
    text: '',
    image: ''
  });
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState({});
  const [tabValue, setTabValue] = useState(0); // 0 for all posts, 1 for my posts
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const { text, image } = postData;

  const fetchPosts = useCallback(async () => {
    try {
      let res;
      if (tabValue === 0) {
        // All posts
        res = await api.get('/posts');
      } else {
        // My posts
        res = await api.get('/posts/me');
      }
      
      setPosts(res.data);
      setError('');
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts');
    }
  }, [tabValue]);

  // Fetch posts when component mounts or tab changes
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const onChange = (e) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

  const handleTabChange = (key) => {
    setTabValue(key === 'all' ? 0 : 1);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you would upload the file to a server
      // For now, we'll just create a local preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPostData({ ...postData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!text && !image) {
      setError('Please provide either text or image');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Prepare data for submission
      const submitData = { ...postData };
      
      await api.post('/posts', submitData);
      
      // Reset form
      setPostData({ text: '', image: '' });
      
      // Refresh posts
      fetchPosts();
    } catch (err) {
      console.error('Error creating post:', err);
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await api.post(`/posts/${postId}/like`);
      // Update the posts state with the updated post
      setPosts(posts.map(post => post._id === postId ? res.data : post));
      setError('');
    } catch (err) {
      console.error('Error liking post:', err);
      setError('Failed to like post');
    }
  };

  const handleComment = async (postId) => {
    const text = commentText[postId];
    if (!text) return;
    
    try {
      const res = await api.post(`/posts/${postId}/comment`, { text });
      // Update the posts state with the updated post
      setPosts(posts.map(post => post._id === postId ? res.data : post));
      // Clear comment text
      setCommentText({ ...commentText, [postId]: '' });
      setError('');
    } catch (err) {
      console.error('Error commenting on post:', err);
      setError('Failed to comment on post');
    }
  };

  const handleCommentChange = (postId, text) => {
    setCommentText({ ...commentText, [postId]: text });
  };

  return (
    <div className="feed-container">
      <div className="feed-header">
        <h1>Social Media App</h1>
        <div className="header-actions">
          <span>Welcome, {user.username}</span>
          <button className="logout-button" onClick={onLogout}>Logout</button>
        </div>
      </div>
      
      {error && (
        <div className="auth-error" style={{ maxWidth: '600px', margin: '0 auto 20px' }}>
          {error}
        </div>
      )}
      
      <div className="feed-content">
        <div className="tabs-container">
          <button
            className={`tab-button ${tabValue === 0 ? 'active' : ''}`}
            onClick={() => setTabValue(0)}
          >
            <Public className="tab-icon" /> All Posts
          </button>
          <button
            className={`tab-button ${tabValue === 1 ? 'active' : ''}`}
            onClick={() => setTabValue(1)}
          >
            <Person className="tab-icon" /> My Posts
          </button>
        </div>
        
        <div id="create-post-section" className="create-post-card">
          <h2>Create Post</h2>
          
          <form onSubmit={onSubmit}>
            <textarea
              rows={4}
              placeholder="What's on your mind?"
              name="text"
              value={text}
              onChange={onChange}
              disabled={loading}
              className="post-textarea"
            />
            <div className="character-count">
              {text.length}/500 characters
            </div>
            
            {image && (
              <div className="image-preview">
                <img 
                  src={image} 
                  alt="Preview" 
                />
              </div>
            )}
            
            <div className="post-actions">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <button
                type="button"
                onClick={triggerFileSelect}
                disabled={loading}
                className="image-button"
              >
                <PhotoCamera /> Add Photo
              </button>
              
              <button
                type="submit"
                disabled={loading || (!text && !image)}
                className="post-button"
              >
                {loading ? 'Posting...' : 'Post'}
              </button>
            </div>
          </form>
        </div>
        
        {/* Posts section */}
        <div className="posts-container">
          {posts.length === 0 ? (
            <div className="no-posts">
              <h3>No posts to display</h3>
              <p>
                {tabValue === 0 
                  ? "Be the first to create a post!" 
                  : "You haven't created any posts yet."}
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post._id} className="post-card">
                <div className="post-header">
                  <div className="user-avatar">
                    {post.user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-info">
                    <h4>{post.user.username}</h4>
                    <p>{new Date(post.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                
                {post.text && (
                  <div className="post-content">
                    <p>{post.text}</p>
                  </div>
                )}
                
                {post.image && (
                  <div className="post-image">
                    <img src={post.image} alt="Post" />
                  </div>
                )}
                
                <div className="post-actions-container">
                  <button
                    className={`action-button ${post.likes.some(like => like.user === user.id) ? 'liked' : ''}`}
                    onClick={() => handleLike(post._id)}
                  >
                    <Favorite className="action-icon" /> 
                    <span>{post.likes.length}</span>
                  </button>
                  
                  <button className="action-button">
                    <CommentIcon className="action-icon" /> 
                    <span>{post.comments.length}</span>
                  </button>
                </div>
                
                {/* Likes section */}
                {post.likes.length > 0 && (
                  <div className="likes-section">
                    <p>Liked by {post.likes.map(like => like.username).join(', ')}</p>
                  </div>
                )}
                
                {/* Comments section */}
                <div className="comments-section">
                  {post.comments.map((comment) => (
                    <div key={comment._id} className="comment">
                      <div className="comment-header">
                        <div className="comment-avatar">
                          {comment.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="comment-user">
                          <strong>{comment.username}</strong>
                          <span>{new Date(comment.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                      </div>
                      <div className="comment-content">
                        <p>{comment.text}</p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Add comment form */}
                  <div className="add-comment">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentText[post._id] || ''}
                      onChange={(e) => handleCommentChange(post._id, e.target.value)}
                      className="comment-input"
                    />
                    <button 
                      onClick={() => handleComment(post._id)}
                      className="comment-button"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Floating + button */}
      <button 
        className="floating-create-button"
        onClick={() => document.getElementById('create-post-section').scrollIntoView({ behavior: 'smooth' })}
      >
        <AddIcon />
      </button>
    </div>
  );
};

export default CreatePost;