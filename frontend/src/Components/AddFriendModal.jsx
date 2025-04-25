import React, { useState } from 'react';
import './CssComponent/AddFriendModal.css'; // Assuming you have some CSS for the modal"
import axios from 'axios';

const AddFriendModal = ({ onClose }) => {
  const [username, setUsername] = useState('');

  const apiUrl = import.meta.env.VITE_BASE_URL;


  const handleSendRequest = () => {
    if (!username.trim()) return;

    const token = localStorage.getItem('token');


    axios.post(`${apiUrl}/friendship/addFriend`, 
      {
        username: username
      }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('Friend request sent:', response.data);
      onClose(); // Close the modal after sending the request
    })
    .catch(err => {
      console.error(err);
    });


    // After sending:
    setUsername('');
    onClose(); // CLOSE MODAL after sending
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Add Friend</h3>
        <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={handleSendRequest}>Send Request</button>
        <button onClick={onClose} style={{ backgroundColor: '#444', marginTop: '8px' }}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddFriendModal;