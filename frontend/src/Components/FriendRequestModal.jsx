// components/FriendRequestsModal.js
import React, {useEffect, useState} from 'react';
import axios from 'axios';

const FriendRequestsModal = ({ onClose }) => {

  const [requests, setRequests] = useState([]); // State to hold friend requests



  useEffect(() => {
    
    // Fetch friend requests when the modal opens
    fetchFriendRequests();
  }, []);


  const fetchFriendRequests = () => {

    const token = localStorage.getItem('token');
    
    axios.get(`https://localhost:7145/friendship/getRequests`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('Friend request sent:', response.data);
      setRequests(response.data.requests || []); // Assuming the response contains an array of requests
      setLoading(true);
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
            <li key={index}>{request.name || request}</li>
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