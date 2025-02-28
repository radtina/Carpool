// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <div style={styles.navContainer}>
      <nav style={styles.navbar}>
        {/* Left side: Logo linking to the Welcome page */}
        <Link to="/" style={styles.logoLink}>
          <img 
            src="/car-icon.svg" 
            alt="Carpool Logo" 
            style={styles.logo} 
          />
        </Link>

        {/* Right side: Menu items */}
        <div style={styles.menu}>
          <Link to="/find-ride" style={styles.menuLink}>Find a Ride</Link>
          <Link to="/post-ride" style={styles.menuLink}>Post a Ride</Link>
          <Link to="/profile" style={styles.menuLink}>Profile</Link>
        </div>
      </nav>

      {/* White horizontal line under the navbar */}
      <hr style={styles.separator} />
    </div>
  );
}

const styles = {
  navContainer: {
    width: '100%',
    backgroundColor: '#000', // Black background
  },
  navbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 20px',
  },
  logoLink: {
    textDecoration: 'none',
  },
  logo: {
    height: '40px', // Adjust as needed
    width: 'auto',
  },
  menu: {
    display: 'flex',
    gap: '20px', // space between menu items
  },
  menuLink: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '16px',
  },
  separator: {
    border: 'none',
    backgroundColor: '#fff',
    height: '1px',
    margin: 0,
  },
};

export default Navbar;
