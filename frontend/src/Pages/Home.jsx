// Home.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
      navigate('/login'); // Redirect to login if not authenticated
    }
  }, [navigate]);
  
  return (
    <div>
      <h2>Home Page - Welcome!</h2>


      <textarea name="" id=""></textarea>
    </div>
);
};

export default Home;