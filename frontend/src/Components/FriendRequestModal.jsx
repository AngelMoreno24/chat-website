// components/FriendRequestsModal.js
import React, {useEffect, useState} from 'react';
import axios from 'axios';

const FriendRequestsModal = ({ onClose }) => {

  const [requests, setRequests] = useState([]); // State to hold friend requests
  const [token, setToken] = useState(''); // State to hold the token


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
      fetchFriendRequests(token);
    }
  }, [token]);

  const fetchFriendRequests = (token) => {
 
    
    axios.get(`http://localhost:7145/friendship/getRequests`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('Friend request sent:', response.data);
      setRequests(response.data.requests || []); // Assuming the response contains an array of requests
    })
    .catch(err => {
      console.error(err);
    });

  }

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Friend Requests</h3>
        <p>Show incoming friend requests here...</p>

        {requests.length > 0 ? (
          requests.map((request, index) => (
            <li key={index}>{request.SenderUsername || request}</li>
          ))
        ) : (
          <p>No friends found.</p>
        )}


        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default FriendRequestsModal;