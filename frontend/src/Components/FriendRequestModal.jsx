import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CssComponent/AddFriendModal.css'; // reuse modal styling

const FriendRequestsModal = ({ onClose }) => {
  const [requests, setRequests] = useState([]);
  const [token, setToken] = useState('');
  const apiUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) setToken(storedToken);
  }, []);

  useEffect(() => {
    if (token) fetchFriendRequests();
  }, [token]);

  const fetchFriendRequests = () => {
    axios.get(`${apiUrl}/friendship/getRequests`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setRequests(res.data.requests || []))
      .catch(console.error);
  };

  const acceptRequest = (requestId) => {
    axios.patch(`${apiUrl}/friendship/acceptRequest`,
      { userId: requestId },
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(() => fetchFriendRequests())
     .catch(console.error);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Friend Requests</h3>

        {requests.length > 0 ? (
          requests.map((r, i) => (
            <div key={i} className="friend-request">
              <p>{r.SenderUsername}</p>
              <button onClick={() => acceptRequest(r.SenderId)}>Accept</button>
            </div>
          ))
        ) : (
          <p>No friend requests.</p>
        )}

        <button onClick={onClose} style={{ marginTop: '12px', backgroundColor: '#444' }}>
          Close
        </button>
      </div>
    </div>
  );
};

export default FriendRequestsModal;