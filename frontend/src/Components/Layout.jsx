import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import './CssComponent/Layout.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Layout = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newChatName, setNewChatName] = useState('');
  const [chats, setChats] = useState([]);
  const [token, setToken] = useState('');
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();
  const location = useLocation(); // Get current route info
  const { chatId } = useParams(); // Automatically gives you the value after /chat/

  const apiUrl = import.meta.env.VITE_BASE_URL;
  const isChatPage = location.pathname.includes('/chat/');

  //add member popup
  const [isAddMemberPopupOpen, setIsAddMemberPopupOpen] = useState(false);
  const [newMemberUsername, setNewMemberUsername] = useState('');
  
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    } else {
      console.warn('Token not found in localStorage');
    }
  }, []);

  useEffect(() => {
    if (token) {
      getChats();
    }
  }, [token]);

  useEffect(() => {
    if (isChatPage && token && chatId) {
      getMembers();
    }
  }, [isChatPage, token, chatId]);

  const getChats = () => {

    axios.get(`${apiUrl}/chat/getChats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('Chats fetched:', response.data);
      setChats(response.data.chats || []);
    })
    .catch(err => {
      console.error(err);
    });
  }


  const getMembers = () => {

    
    axios.post(`${apiUrl}/chat/getChatMembers`,
      {
        chatId: chatId
      }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('Chat members fetched:', response.data);
      
      setMembers(response.data.members || []);
    })
    .catch(err => {
      console.error(err);
    });
  }

  const [isAdding, setIsAdding] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const addMember = () => {
    setIsAdding(true);
    axios.post(`${apiUrl}/chat/addChatMember`, {
      chatId: chatId,
      friendUsername: newMemberUsername
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      setMembers(response.data.members || []);
      setIsAddMemberPopupOpen(false);
      setNewMemberUsername('');
      setErrorMsg('');
    })
    .catch(err => {
      console.error(err);
      setErrorMsg('Failed to add member.');
    })
    .finally(() => {
      setIsAdding(false);
    });
  };

  const createChat = () => {
    setIsAdding(true);
    axios.post(`${apiUrl}/chat/create`, {
      name: newChatName
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => { 
      setIsPopupOpen(false);
      setNewChatName('');
      setErrorMsg('');
      getChat();
    })
    .catch(err => {
      console.error(err);
      setErrorMsg('Failed to add member.');
    })
    .finally(() => {
      setIsAdding(false);
    });
  };


  return (
    <div className="layout">
      <nav className="layout__sidebar layout__sidebar--left">
        <h3 className="layout__sidebar-title">Chats</h3>
        <button className="layout__new-chat-btn" onClick={() => navigate('/home')}>Friends</button>
        <button className="layout__new-chat-btn" onClick={() => setIsPopupOpen(true)}>+ New Chat</button>

        <ul className="layout__nav-list">
          {chats.map(chat => (
            <li key={chat.Id} className="layout__nav-item">
              <div className="layout__chat-item">
                <Link
                  to={`/chat/${chat.Id}`}
                  state={{ chatName: chat.Name, members: chat.Members }}
                  className={`layout__nav-link`}
                >
                  {chat.Name}
                </Link>
              </div>
            </li>
          ))}
        </ul>

        <button onClick={handleLogout} className="layout__logout-btn">Logout</button>
      </nav>

      <div className="layout__content">
        <main className="layout__main">
          <Outlet />
        </main>
      </div>

      <aside className="layout__sidebar layout__sidebar--right">

        {(isChatPage)?(
          <div className="layout__users"> 
            <button
              className="layout__new-chat-btn"

              onClick={() => { 
                setIsAddMemberPopupOpen(true);
                setNewMemberUsername('');
              }}            >
              + Add Member
            </button>
            <h3>Users</h3>
            {members.length > 0 ? (
              members.map((member, index) => (
                <p key={index}>{member.Username || member}</p>
              ))
            ) : (
              <p>No members found.</p>
            )}
          </div>
        ):(
          
          <p></p>
        )}
      </aside>


      {isAddMemberPopupOpen && (
  <div className="popup">
    <div className="popup__content">
      <h3>Add Member to Chat</h3>
      <input
        type="text"
        placeholder="Enter username..."
        className="popup__input"
        value={newMemberUsername}
        onChange={(e) => setNewMemberUsername(e.target.value)}
      />
      <button
        className="popup__send-btn"
        onClick={() => {
          addMember(); // 🔥 Call the function here
          setIsAddMemberPopupOpen(false);
          setNewMemberUsername('');
        }}
        disabled={newMemberUsername.trim() === ''}
      >
        Add Member
      </button>
      <button
        className="popup__close-btn"
        onClick={() => setIsAddMemberPopupOpen(false)}
      >
        Cancel
      </button>
    </div>
  </div>
)}

      
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
            <button
              className="popup__send-btn"
              onClick={() => {
                createChat();
                setIsPopupOpen(false);
                setNewChatName('');
              }}
              disabled={newChatName.trim() === ''}
            >
              Create Chat
            </button>
            <button className="popup__close-btn" onClick={() => setIsPopupOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;