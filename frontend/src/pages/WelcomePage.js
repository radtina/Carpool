import React from 'react';
import { Link } from 'react-router-dom';

function WelcomePage() {
  const isLoggedIn = !!localStorage.getItem('token'); // or however you detect login

  return (
    <div style={styles.container}>
      <div style={styles.overlay}>
        <h1 style={styles.title}>Welcome to Carpool</h1>
        <h2 style={styles.subtitle}>Your Journey, Shared.</h2>
        <p style={styles.text}>
          Effortless ride-sharing that connects you with fellow commuters
          for a greener, more economical travel experience.
        </p>
        <div style={styles.buttonContainer}>
          {isLoggedIn ? (
            <>
              <Link to="/find-ride" style={styles.link}>Find a Ride</Link>
              <div style={styles.divider}></div>
              <Link to="/post-ride" style={styles.link}>Post a Ride</Link>
            </>
          ) : (
            <>
              <Link to="/register" style={styles.link}>Register</Link>
              <div style={styles.divider}></div>
              <Link to="/login" style={styles.link}>Log In</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    width: '100%',
    height: '100vh',
    background: 'url("/welcome-bg.jpg") center center / cover no-repeat',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    textAlign: 'center',
  },
  title: {
    fontSize: '3rem',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '2rem',
    marginBottom: '1rem',
  },
  text: {
    maxWidth: '600px',
    margin: '0 auto 2rem',
    lineHeight: 1.5,
  },
  buttonContainer: {
    display: 'flex',
    gap: '20px',
  },
  link: {
    fontSize: '1.2rem',
    color: '#fff',
    textDecoration: 'none',
    textShadow: '1px 1px 2px rgba(0,0,0,0.6)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '5px',
  },
  divider: {
    width: '1px',
    backgroundColor: '#fff',
    height: '1.2em', // Matches the text height
    alignSelf: 'center',
  },
};

export default WelcomePage;
