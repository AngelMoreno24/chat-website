// components/FriendRequestsModal.js
import React from 'react';

const FriendRequestsModal = ({ onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Friend Requests</h3>
        <p>Show incoming friend requests here...</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default FriendRequestsModal;