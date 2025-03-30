import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';

const Layout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  return (
    <div>
      <nav>
        <ul>
          <li><Link to="/home">Home</Link></li>
          <li><button onClick={handleLogout}>Logout</button></li>
        </ul>
      </nav>

      <main>
        <Outlet />
      </main>

      <footer>
        <p>© 2025 My Website</p>
      </footer>
    </div>
  );
};

export default Layout;