import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddFriendModal from '../Components/AddFriendModal.jsx';
import FriendRequestsModal from '../Components/FriendRequestModal.jsx';
import './CssPages/Home.css';

const Home = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');

  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [showRequestsModal, setShowRequestsModal] = useState(false);

  const apiUrl = import.meta.env.VITE_BASE_URL;

  // Load token
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) setToken(storedToken);
  }, []);

  // Fetch friends when token is available
  useEffect(() => {
    if (token) fetchFriends();
  }, [token]);

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/friendship/getFriends`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFriends(res.data.friends || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-window">
      <h1 className="home-title">Friends Dashboard</h1>

      <div className="button-group">
        <button onClick={() => setShowRequestsModal(true)}>👥 Friend Requests</button>
        <button onClick={() => setShowAddFriendModal(true)}>➕ Add Friends</button>
      </div>

      <h2>Friends List</h2>
      {loading ? (
        <p>Loading friends...</p>
      ) : friends.length === 0 ? (
        <p>No friends found.</p>
      ) : (
        <div className="friends-container">
          {friends.map((f, i) => (
            <div key={i} className="friend">{f.Username}</div>
          ))}
        </div>
      )}

      {showAddFriendModal && <AddFriendModal onClose={() => setShowAddFriendModal(false)} />}
      {showRequestsModal && <FriendRequestsModal onClose={() => setShowRequestsModal(false)} />}
    </div>
  );
};

export default Home;