import React, { useState } from 'react';
import './CssComponent/AddFriendModal.css';
import axios from 'axios';

const AddFriendModal = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const apiUrl = import.meta.env.VITE_BASE_URL;

  const handleSendRequest = async () => {
    if (!username.trim()) return;
    const token = localStorage.getItem('token');

    try {
      await axios.post(`${apiUrl}/friendship/addFriend`, { username }, { headers: { Authorization: `Bearer ${token}` } });
      setUsername('');
      onClose();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Add Friend</h3>
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter username" />
        <button onClick={handleSendRequest}>Send Request</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default AddFriendModal;