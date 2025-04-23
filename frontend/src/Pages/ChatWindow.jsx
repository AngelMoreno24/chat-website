import React from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const ChatWindow = () => {
  const { chatId } = useParams();
  const location = useLocation();

  const { chatName, members } = location.state || {};

  return (
    <div>
      <h2>Chat with {chatName}</h2>
      <p>Messages will appear here...</p>
    </div>
  );
};

export default ChatWindow;