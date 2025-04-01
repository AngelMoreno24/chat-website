import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from "./Components/Layout"
import Home from "./Pages/Home"
import NoPage from './Pages/NoPage';
import Login from './Pages/Login';
import ChatWindow from './Pages/ChatWindow';



const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public route - No Layout for login */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes inside Layout */}
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="*" element={<NoPage />} />
          <Route path="/chat/:chatId" element={<ChatWindow />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;