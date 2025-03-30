// Login.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Redirect to home if already logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
      navigate('/'); // Redirect to home
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate authentication (replace with real authentication logic)
    if (email === 'user@example.com' && password === 'password') {
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/'); // Redirect to home after login
    } else {
      alert('Invalid credentials');
    }   

    const BaseUrl = process.env.REACT_APP_API_BASE_URL

    const response = axios({
        method: 'post',
        url: `${BaseUrl}/api/Account/login`,
        data: {
          firstName: email,
          lastName: password
        }
      });


  };

  const login = (event) => {
    event.preventDefault(); // Prevents the default form submission behavior

    console.log("logging in " + email + "password= " + password);
    console.log("logging in " + email + "password= " + password);

    axios.post(`${BaseUrl}/api/Account/login`,   
      {
      email: email,
      password: password
      }
    )
    .then(data => {
      localStorage.setItem('token', data.data.accessToken);
      console.log(data.data) 
      navigate('home/'); 
    
    })
    .catch(error => console.log(error));
    
  }


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
  container: { maxWidth: '300px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column' },
  inputGroup: { marginBottom: '10px' },
  button: { padding: '10px', background: 'blue', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
};

export default Login;