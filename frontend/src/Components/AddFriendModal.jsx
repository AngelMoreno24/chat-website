import React, { useState } from 'react';
import './CssComponent/AddFriendModal.css'; // Assuming you have some CSS for the modal"

const AddFriendModal = ({ onClose }) => {
  const [friendCode, setFriendCode] = useState('');

  const handleSendRequest = () => {
    if (!friendCode.trim()) return;

    console.log('Sending request to:', friendCode);

    // You can replace this with an actual API call


    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');


    axios.post(`http://localhost:7145/friendship/addFriend`, 
      {
        friendCode: friendCode
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
    setFriendCode('');
    onClose(); // CLOSE MODAL after sending
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Add Friend</h3>
        <input
          type="text"
          placeholder="Enter Friend Code"
          value={friendCode}
          onChange={(e) => setFriendCode(e.target.value)}
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