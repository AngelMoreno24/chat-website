import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FriendRequestsModal from '../Components/FriendRequestModal.jsx';
import AddFriendModal from '../Components/AddFriendModal.jsx';
import './CssPages/Home.css'; // Import the CSS file

const Home = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn) getFriends();
  }, []);

  const getFriends = () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');
    axios.post(`https://localhost:7145/friendship/getFriends`, {}, {
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
      console.error(err);
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

      <ol>
        {friends.length > 0 ? (
          friends.map((friend, index) => (
            <li key={index}>{friend.name || friend}</li>
          ))
        ) : (
          !loading && <p>No friends found.</p>
        )}
      </ol>

      {showRequestsModal && <FriendRequestsModal onClose={() => setShowRequestsModal(false)} />}
      {showAddFriendModal && <AddFriendModal onClose={() => setShowAddFriendModal(false)} />}
    </div>
  );
};

export default Home;