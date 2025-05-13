import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CssPages/Login.css'; // Import the CSS

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const apiUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/home');
  }, [navigate]);

  const login = (e) => {
    e.preventDefault();
    axios.post(`${apiUrl}/auth/login`, { email, password })
      .then(res => {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('isLoggedIn', 'true');
        setTimeout(() => navigate('/home', { state: { justLoggedIn: true } }), 50);
      })
      .catch(err => {
        console.error('Login error:', err);
        alert('Login failed. Please check your credentials.');
      });
  };

  const signup = (e) => {
    e.preventDefault();
    axios.post(`${apiUrl}/auth/register`, {
      username: registerUsername,
      email: registerEmail,
      password: registerPassword
    })
    .then(() => alert('Signup successful. You can now log in.'))
    .catch(err => {
      console.error('Signup error:', err);
      alert('Signup failed. Please check your input.');
    });
  };

  return (
    <div className="wrapper">
      <div className="form-container">
        <h2>Login</h2>
        <form onSubmit={login} className="form">
          <div className="input-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="button">Login</button>
        </form>
      </div>

      <div className="form-container">
        <h2>Signup</h2>
        <form onSubmit={signup} className="form">
          <div className="input-group">
            <label>Username:</label>
            <input
              type="text"
              value={registerUsername}
              onChange={(e) => setRegisterUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Email:</label>
            <input
              type="email"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password:</label>
            <input
              type="password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="button">Signup</button>
        </form>
      </div>
    </div>
  );
};

export default Login;