// src/components/RideCard.js
import React, { useState } from 'react';
// You can optionally import icons from a library like react-icons or use your own SVGs
// import { FaRegClock, FaMapMarkerAlt, FaStar } from 'react-icons/fa';

function RideCard({
  from_address,
  to_address,
  ride_time,
  eta,
  price,
  driver_name,
  driver_rating,
  onClick
}) {
  const [hovered, setHovered] = useState(false);

  // Format the ride time more nicely if needed
  const formattedTime = ride_time
    ? `${new Date(ride_time).toLocaleDateString()} ${new Date(ride_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    : '';

  return (
    <div
      style={{
        ...styles.card,
        ...(hovered ? styles.cardHover : {})
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top row: FROM city/time, price on the right */}
      <div style={styles.topRow}>
        <div style={styles.cityTime}>
          {/* If you have icons, you can use something like: 
             <FaMapMarkerAlt style={styles.icon} /> 
          */}
          <span style={styles.city}>{from_address}</span>
          <span style={styles.time}>{formattedTime}</span>
        </div>
        <div style={styles.price}>
          {price} €
        </div>
      </div>

      {/* Middle row: arrow or dash indicating going from -> to */}
      <div style={styles.row}>
        <div style={styles.arrow}>
        ⋮
        </div>
      </div>

      {/* Next row: TO city/time, optional ETA */}
      <div style={styles.row}>
        <div style={styles.cityTime}>
          <span style={styles.city}>{to_address}</span>
          <span style={styles.time}>{eta ? eta : 'N/A'}</span>
        </div>
      </div>

      {/* Bottom row: Driver info + rating */}
      <div style={styles.row}>
        <div style={styles.driver}>
          <img src="/profilepic.svg" alt="Driver" style={styles.profilePic} />
          <span style={styles.driverName}>{driver_name}</span>
        </div>
        <div style={styles.rating}>{driver_rating} ★</div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    // Basic layout
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(8px)',

    // Size & spacing
    width: '300px',
    minHeight: '180px',
    padding: '20px',
    boxSizing: 'border-box',
    margin: '0 auto',

    // Frosted glass-like background
    //backdropFilter: 'blur(8px)', // This requires the container to have background/backdrop support
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.3)',

    // Text & visuals
    color: '#fff',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  cardHover: {
    transform: 'scale(1.03)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.25)',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  cityTime: {
    display: 'flex',
    flexDirection: 'column',
  },
  city: {
    fontSize: '1rem',
    fontWeight: '600',
  },
  time: {
    fontSize: '0.9rem',
    opacity: 0.8,
  },
  arrow: {
    fontSize: '1.5rem',
    color: '#fff',
    opacity: 0.7,
    textAlign: 'center',
    width: '20%',
  },
  price: {
    fontSize: '1rem',
    fontWeight: 'bold',
    textAlign: 'right',
    width: '50%',
    
  },
  driver: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  driverName: {
    fontSize: '0.9rem',
  },
  rating: {
    fontSize: '0.9rem',
    fontWeight: 'bold',
  },
  profilePic: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '1px solid #ccc',
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
    alignItems: 'flex-start', // align items at the top
  },
};

export default RideCard;
