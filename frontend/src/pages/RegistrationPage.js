// src/pages/RegistrationPage.js
import api from '../services/api';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import RoundedInput from '../components/RoundedInput';
import RoundedButton from '../components/RoundedButton';

function RegistrationPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
  
    try {
      const response = await api.post('/register', {
        name,
        email,
        password
      });
  
      console.log('Registration success:', response.data);
      // After successful registration, navigate to login or find-ride
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      alert('Failed to register. Please try again.');
    }
  };
  

  return ( 
    <>
      <Navbar />
      <div style={styles.container}>
      <h2>Register</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <RoundedInput
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
          <RoundedInput
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <RoundedButton type="submit" style={styles.button}>
            Register
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

export default RegistrationPage;
