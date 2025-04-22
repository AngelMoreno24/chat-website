// Login.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/home'); // Redirect if already logged in
    }
  }, [navigate]);

  const login = (event) => {
    event.preventDefault();

    axios.post('http://localhost:7145/auth/login', {
      email: email,
      password: password
    })
    .then(data => {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('isLoggedIn', 'true');

      // Tiny delay to allow token to be saved before navigation
      setTimeout(() => {
        navigate('/home', { state: { justLoggedIn: true } });
      }, 50);
    })
    .catch(error => {
      console.error('Login error:', error);
      alert('Login failed. Please check your credentials.');
    });
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      <form onSubmit={login} style={styles.form}>
        <div style={styles.inputGroup}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" style={styles.button}>Login</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '300px',
    margin: '50px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    textAlign: 'center'
  },
  form: { display: 'flex', flexDirection: 'column' },
  inputGroup: { marginBottom: '10px' },
  button: {
    padding: '10px',
    background: 'blue',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
};

export default Login;