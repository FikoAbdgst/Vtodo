// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Start from './pages/start/Start';
import Register from './pages/register/Register';
import Login from './pages/login/Login';
import Home from './pages/home/Home';
import ForgotCheckEmail from './pages/forgot/ForgotCheckEmail';
import ForgotCheckName from './pages/forgot/ForgotCheckName';
import ForgotCheckPassword from './pages/forgot/ForgotCheckPassword';
import ChangePassword from './pages/forgot/ChangePassword';
import TaskList from './pages/TaskList';
import Calendar from './pages/Calendar';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-check-email" element={<ForgotCheckEmail />} />
          <Route path="/forgot-check-name" element={<ForgotCheckName />} />
          <Route path="/forgot-check-password" element={<ForgotCheckPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/home" element={<Home />} />
          <Route path="/tasklist" element={<TaskList />} />
          <Route path="/calendar" element={<Calendar />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
