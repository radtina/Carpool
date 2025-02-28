// src/pages/LoginPage.js
import api from '../services/api';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import RoundedInput from '../components/RoundedInput';
import RoundedButton from '../components/RoundedButton';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/login', { email, password });
      const token = response.data.token;
      // Save token in localStorage for later requests
      localStorage.setItem('token', token);
      console.log('Login successful:', response.data);
      navigate('/find-ride'); // Navigate after successful login
    } catch (error) {
      console.error('Login error:', error);
      alert('Failed to log in. Please check your credentials and try again.');
    }
  };

  return (
    <>
      <Navbar />
        <div style={styles.container}>
        <h2>Log in</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <RoundedInput
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <RoundedInput
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <RoundedButton type="submit" style={styles.button}>
              Login
            </RoundedButton>
          </form>
        </div>
    </>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '20px',
    boxSizing: 'border-box',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginTop: '20px',
  },
  button: {
    width: '100%',
    boxSizing: 'border-box',
  },
};

export default LoginPage;
