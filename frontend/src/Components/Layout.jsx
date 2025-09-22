import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './CssComponent/Layout.css';

const Layout = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newChatName, setNewChatName] = useState('');
  const [chats, setChats] = useState([]);
  const [token, setToken] = useState('');
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { chatId } = useParams();
  const apiUrl = import.meta.env.VITE_BASE_URL;
  const isChatPage = location.pathname.includes('/chat/');

  const [isAddMemberPopupOpen, setIsAddMemberPopupOpen] = useState(false);
  const [newMemberUsername, setNewMemberUsername] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) setToken(storedToken);
  }, []);

  useEffect(() => { if (token) getChats(); }, [token]);
  useEffect(() => { if (isChatPage && token && chatId) getMembers(); }, [isChatPage, token, chatId]);

  const getChats = () => {
    axios.get(`${apiUrl}/chat/getChats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => setChats(res.data.chats || []))
      .catch(console.error);
  };

  const getMembers = () => {
    axios.post(`${apiUrl}/chat/getChatMembers`, { chatId }, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => setMembers(res.data.members || []))
      .catch(console.error);
  };

  const addMember = () => {
    if (!newMemberUsername.trim()) return;
    axios.post(`${apiUrl}/chat/addChatMember`, { chatId, friendUsername: newMemberUsername }, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => {
      setMembers(res.data.members || []);
      setIsAddMemberPopupOpen(false);
      setNewMemberUsername('');
    }).catch(console.error);
  };

  const createChat = () => {
    if (!newChatName.trim()) return;
    axios.post(`${apiUrl}/chat/create`, { name: newChatName }, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(() => {
      setIsPopupOpen(false);
      setNewChatName('');
      getChats();
    }).catch(console.error);
  };

  return (
    <div className="layout">
      {/* Left Sidebar */}
      <nav className="layout__sidebar layout__sidebar--left">
        <h3 className="layout__sidebar-title">Chats</h3>
        <button className="layout__new-chat-btn" onClick={() => navigate('/home')}>Friends</button>
        <button className="layout__new-chat-btn" onClick={() => setIsPopupOpen(true)}>+ New Chat</button>

        <ul className="layout__nav-list">
          {chats.map(chat => (
            <li key={chat.Id} className="layout__nav-item">
              <Link to={`/chat/${chat.Id}`} className="layout__nav-link">
                {chat.Name}
              </Link>
            </li>
          ))}
        </ul>

        <button onClick={handleLogout} className="layout__logout-btn">Logout</button>
      </nav>

      {/* Main Content */}
      <div className="layout__content">
        <main className="layout__main">
          <Outlet />
        </main>
      </div>

      {/* Right Sidebar */}
      <aside className="layout__sidebar layout__sidebar--right">
        {isChatPage && (
          <div className="layout__users">
            <button
              className="layout__new-chat-btn"
              onClick={() => setIsAddMemberPopupOpen(true)}
            >
              + Add Member
            </button>
            <h3>Users</h3>
            {members.length > 0 ? members.map((m, i) => (
              <div key={i} className="layout__user-item">{m.Username || m}</div>
            )) : <p>No members found.</p>}
          </div>
        )}
      </aside>

      {/* Popups */}
      {isAddMemberPopupOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add Member</h3>
            <input value={newMemberUsername} onChange={e => setNewMemberUsername(e.target.value)} placeholder="Username" />
            <button onClick={addMember}>Add Member</button>
            <button onClick={() => setIsAddMemberPopupOpen(false)}>Cancel</button>
          </div>
        </div>
      )}

      {isPopupOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Create New Chat</h3>
            <input value={newChatName} onChange={e => setNewChatName(e.target.value)} placeholder="Chat name" />
            <button onClick={createChat}>Create Chat</button>
            <button onClick={() => setIsPopupOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;