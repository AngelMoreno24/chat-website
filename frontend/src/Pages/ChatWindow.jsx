import React from 'react';
import { useParams } from 'react-router-dom';

const ChatWindow = () => {
  const { chatId } = useParams();

  return (
    <div>
      <h2>Chat with {chatId}</h2>
      <p>Messages will appear here...</p>
    </div>
  );
};

export default ChatWindow;