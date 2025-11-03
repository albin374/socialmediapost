import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './customStyles.css';
import Login from './components/Login';
import Signup from './components/Signup';
import CreatePost from './components/CreatePost';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          <Route path="/create" element={user ? <CreatePost user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to="/create" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;