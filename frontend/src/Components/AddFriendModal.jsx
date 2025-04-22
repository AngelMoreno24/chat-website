// components/AddFriendModal.js
import React from 'react';

const AddFriendModal = ({ onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Add Friend</h3>
        <p>Search and add users here...</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default AddFriendModal;