// src/components/RideCard.js
import React, { useState } from 'react';

function RideCard({ from_address, to_address, ride_time, eta, price, driverName, rating, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.card,
        ...(hovered ? styles.cardHover : {}),
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Row 1 */}
      <div style={{ gridColumn: '1', gridRow: '1' }}>{from_address}</div>
      <div style={{ ...styles.secondCol, gridColumn: '2', gridRow: '1' }}>{ride_time}</div>
      <div style={{ gridColumn: '3', gridRow: '1', textAlign: 'right' }}>{price} €</div>

      {/* Row 2 */}
      <div style={styles.arrowCell}>↓</div>
      {/* Columns 2 & 3 of row 2 are empty */}

      {/* Row 3 */}
      <div style={{ gridColumn: '1', gridRow: '3' }}>{to_address}</div>
      <div style={{ ...styles.secondCol, gridColumn: '2', gridRow: '3' }}>{eta}</div>
      {/* Column 3 of row 3 is empty */}

      {/* Row 4 */}
      <div style={{ gridColumn: '1', gridRow: '4' }}>
        <img src="/profilepic.svg" alt="Driver" style={styles.profilePic} />
      </div>
      <div style={{ ...styles.secondCol, gridColumn: '2', gridRow: '4' }}>{driverName}</div>
      <div style={{ gridColumn: '3', gridRow: '4', textAlign: 'right' }}>{rating} ★</div>
    </div>
  );
}

const styles = {
  card: {
    width: '250px',
    display: 'grid',
    gridTemplateColumns: '0.6fr 1fr 1fr',       // 3 columns
    gridTemplateRows: '1fr 1fr 1fr 1fr',  // 4 rows
    gap: '5px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: '2px solid #fff',
    borderRadius: '8px',
    padding: '20px',
    boxSizing: 'border-box',
    color: '#fff',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  cardHover: {
    transform: 'scale(1.05)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
  },
  secondCol: {
    textAlign: 'left',
    justifySelf: 'start', // Align content to start of the cell
    paddingRight: '0px',   // Remove extra left padding
  },
  arrowCell: {
    gridColumn: '1',
    gridRow: '2',
    display: 'flex',
    alignItems: 'left',
    justifyContent: 'left',
    paddingLeft: '9px',

  },
  profilePic: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    border: '1px solid #ccc',
    objectFit: 'cover',
  },
};

export default RideCard;
