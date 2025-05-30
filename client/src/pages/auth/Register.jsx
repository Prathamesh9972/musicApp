// src/pages/auth/Register.jsx
import React, { useState } from 'react';
import { registerUser } from '../../services/api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // default role
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await registerUser({ name, email, password, role });

    if (data._id) {
      setMessage('Registration successful! Please login.');
    } else {
      setMessage(data.message || 'Registration failed');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        /><br />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
        </select><br />
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
