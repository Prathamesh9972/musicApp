// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';

export default function App() {
  return (
    <Router>
      <nav style={{ marginBottom: '20px' }}>
        <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
        <Link to="/register">Register</Link>
      </nav>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}
