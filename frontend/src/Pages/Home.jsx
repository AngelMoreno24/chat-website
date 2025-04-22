import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      //window.location.href = '/login';
    } else {
      getFriends();
    }
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
      const data = response.data;
      setFriends(data.friends || []);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setError('Failed to load friends.');
      setLoading(false);
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Friends Dashboard</h1>

      <div style={{ marginBottom: '15px' }}>
        <button onClick={() => setShowRequestsModal(true)} style={{ marginRight: '10px' }}>
          👥 Friend Requests
        </button>
        <button onClick={() => setShowAddFriendModal(true)}>
          ➕ Add Friends
        </button>
      </div>

      <h2>Friends List</h2>
      {loading && <p>Loading friends...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ol>
        {friends.length > 0 ? (
          friends.map((friend, index) => (
            <li key={index}>{friend.name || friend}</li>
          ))
        ) : (
          !loading && <p>No friends found.</p>
        )}
      </ol>

      {/* Friend Requests Modal */}
      {showRequestsModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Friend Requests</h3>
            <p>Show incoming friend requests here...</p>
            <button onClick={() => setShowRequestsModal(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Add Friend Modal */}
      {showAddFriendModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add Friend</h3>
            <p>Search and add users here...</p>
            <input></input>
            <button onClick={() => setShowAddFriendModal(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Modal styling */}
      <style>{`
        .modal {
          position: fixed;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          max-width: 400px;
          width: 90%;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }

        .modal-content h3 {
          margin-top: 0;
        }

        .modal-content button {
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default Home;