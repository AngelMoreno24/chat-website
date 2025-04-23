import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FriendRequestsModal from '../Components/FriendRequestModal.jsx';
import AddFriendModal from '../Components/AddFriendModal.jsx';
import './CssPages/Home.css';

const Home = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [token, setToken] = useState('');

  // Load token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    } else {
      console.warn('Token not found in localStorage');
    }
  }, []);

  // Fetch friends only after token is set
  useEffect(() => {
    if (token) {
      console.log('Token found:', token); // Debug log
      getFriends(token);
    }
  }, [token]);

  const getFriends = (token) => {
    setLoading(true);
    setError(null);

    console.log('Fetching friends with token:', token); // Debug log

    axios.get('http://localhost:7145/friendship/getFriends', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        setFriends(response.data.friends || []);

        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch friends:', err);
        setError('Failed to load friends.');
        setLoading(false);
      });
  };

  return (
    <div className="home-container">
      <h1>Friends Dashboard</h1>

      <div className="button-group">
        <button onClick={() => setShowRequestsModal(true)}>👥 Friend Requests</button>
        <button onClick={() => setShowAddFriendModal(true)}>➕ Add Friends</button>
      </div>

      <h2>Friends List</h2>
      {loading && <p>Loading friends...</p>}
      {error && <p className="error">{error}</p>}

      <ul>
        {friends.length > 0 ? (
          friends.map((friend, index) => (
            <li key={index}>{friend.Username}</li>
          ))
        ) : (
          !loading && <p>No friends found.</p>
        )}
      </ul>

      {showRequestsModal && (
        <FriendRequestsModal onClose={() => setShowRequestsModal(false)} />
      )}
      {showAddFriendModal && (
        <AddFriendModal onClose={() => setShowAddFriendModal(false)} />
      )}
    </div>
  );
};

export default Home;