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
      fetchFriendRequests();
    }
  }, [token]);

  const fetchFriendRequests = () => {
 
    
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


  const acceptRequest = (requestId) => {
    
    axios.patch(`http://localhost:7145/friendship/acceptRequest`, 
      {
        userId: requestId
      }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('Friend request accepted:', response.data); 
      fetchFriendRequests();
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
            <div key={index} className='friend-request'> 
              <p>{request.SenderUsername}</p>
              <button onClick={() => {acceptRequest(request.SenderId)}}>Accept</button>
            </div>
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