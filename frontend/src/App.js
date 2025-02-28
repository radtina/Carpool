// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import ProfilePage from './pages/ProfilePage';
import FindRidePage from './pages/FindRidePage';
import ChooseRidePage from './pages/ChooseRidePage';
import SelectedRidePage from './pages/SelectedRidePage';
import PostRidePage from './pages/PostRidePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/find-ride" element={<FindRidePage />} />
        <Route path="/choose-ride" element={<ChooseRidePage />} />
        <Route path="/selected-ride" element={<SelectedRidePage />} />
        <Route path="/post-ride" element={<PostRidePage />} />
      </Routes>
    </Router>
  );
}

export default App;
