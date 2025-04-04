import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import './CssComponent/Layout.css';
import axios from 'axios';
const Layout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newChatName, setNewChatName] = useState('');
  const [manageChatId, setManageChatId] = useState(null);
  const [conversations, setConversations] = useState([
    { id: 1, name: "Alice", members: ["Alice"] },
    { id: 2, name: "Bob", members: ["Bob"] },
    { id: 3, name: "Group Chat 1", members: ["Alice", "Bob"] }
  ]);

  const [users] = useState(["Alice", "Bob", "Charlie", "David", "Emma"]); // Dummy users

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  const createNewChat = () => {
    if (newChatName.trim() === '') return;
    const newChat = { id: conversations.length + 1, name: newChatName, members: [] };
    setConversations([...conversations, newChat]);
    setNewChatName('');
    setIsPopupOpen(false);
  };

  const openManageChat = (chatId) => {
    setManageChatId(chatId);
  };

  const closeManageChat = () => {
    setManageChatId(null);
  };

  const toggleMember = (chatId, user) => {
    setConversations(conversations.map(chat => {
      if (chat.id === chatId) {
        const isMember = chat.members.includes(user);
        return {
          ...chat,
          members: isMember ? chat.members.filter(m => m !== user) : [...chat.members, user]
        };
      }
      return chat;
    }));
  };

  return (
    <div className="layout">
      {/* Left Sidebar (Chat Navigation) */}
      <nav className={`layout__sidebar layout__sidebar--left ${isOpen ? 'open' : ''}`}>
        <h3 className="layout__sidebar-title">Chats</h3>
        <button className="layout__new-chat-btn" onClick={() => setIsPopupOpen(true)}>
          + New Chat
        </button>
        <ul className="layout__nav-list">
          {conversations.map(chat => (
            <li key={chat.id} className="layout__nav-item">
              <div className="layout__chat-item">
                <Link to={`/chat/${chat.id}`} className="layout__nav-link" onClick={() => setIsOpen(false)}>
                  {chat.name}
                </Link>
                <button className="layout__manage-btn" onClick={() => openManageChat(chat.id)}>⚙️</button>
              </div>
            </li>
          ))}
        </ul>
        <button onClick={handleLogout} className="layout__logout-btn">Logout</button>
      </nav>

      {/* Toggle Button for Sidebar */}
      <button className={`layout__toggle-btn ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        ☰ Chats
      </button>

      {/* Main Content (Chat Window) */}
      <div className="layout__content">
        <main className="layout__main">
          <Outlet />
        </main>
      </div>

      {/* Right Sidebar (Online Users / Settings) */}
      <aside className="layout__sidebar layout__sidebar--right">
        <h3>Online Users</h3>
        <p>Coming soon...</p>
      </aside>

      {/* Create New Chat Popup */}
      {isPopupOpen && (
        <div className="popup">
          <div className="popup__content">
            <h3>Create New Chat</h3>
            <input
              type="text"
              placeholder="Enter chat name..."
              className="popup__input"
              value={newChatName}
              onChange={(e) => setNewChatName(e.target.value)}
            />
            <button className="popup__send-btn" onClick={createNewChat} disabled={newChatName.trim() === ''}>
              Create Chat
            </button>
            <button className="popup__close-btn" onClick={() => setIsPopupOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Manage Chat Members Popup */}
      {manageChatId !== null && (
        <div className="popup">
          <div className="popup__content">
            <h3>Manage Chat Members</h3>
            <ul className="popup__user-list">
              {users.map(user => (
                <li key={user} className="popup__user-item">
                  <span>{user}</span>
                  <button
                    className={`popup__toggle-btn ${conversations.find(chat => chat.id === manageChatId)?.members.includes(user) ? 'remove' : 'add'}`}
                    onClick={() => toggleMember(manageChatId, user)}
                  >
                    {conversations.find(chat => chat.id === manageChatId)?.members.includes(user) ? 'Remove' : 'Add'}
                  </button>
                </li>
              ))}
            </ul>
            <button className="popup__close-btn" onClick={closeManageChat}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;