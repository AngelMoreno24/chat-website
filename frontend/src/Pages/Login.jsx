import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CssPages/Login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login/signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const apiUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/home');
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post(`${apiUrl}/auth/login`, { email, password })
      .then(res => {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('name', res.data.name);
        localStorage.setItem('isLoggedIn', 'true');
        navigate('/home', { state: { justLoggedIn: true } });
      })
      .catch(err => alert('Login failed. Check your credentials.'));
  };

  const handleSignup = (e) => {
    e.preventDefault();
    axios.post(`${apiUrl}/auth/register`, { username, email, password })
      .then(() => alert('Signup successful. You can now log in.'))
      .catch(err => alert('Signup failed. Check your input.'));
  };

  return (
    <div className="wrapper">
      <div className="form-container">
        <h2>{isLogin ? 'Login' : 'Signup'}</h2>

        <form onSubmit={isLogin ? handleLogin : handleSignup} className="form">
          {!isLogin && (
            <div className="input-group">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
          )}
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="button">
            {isLogin ? 'Login' : 'Signup'}
          </button>
        </form>

        <p className="toggle-text">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span className="toggle-link" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? ' Sign up' : ' Login'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;