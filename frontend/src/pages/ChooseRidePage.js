// src/pages/ChooseRidePage.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import RideCard from '../components/RideCard';

function ChooseRidePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const rides = location.state && location.state.rides;

  const handleCardClick = (ride) => {
    navigate('/selected-ride', { state: { ride } });
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>Choose a Ride</h2>
        {rides && rides.length > 0 ? (
          <div style={styles.grid}>
            {rides.map((ride) => (
              <RideCard
                key={ride.ride_id || ride.id}
                from_address={ride.from_address}
                to_address={ride.to_address}
                ride_time={ride.ride_time}
                eta={ride.eta}
                price={ride.price}
                driver_name={ride.driver_name}
                rating={ride.rating}
                onClick={() => handleCardClick(ride)}
              />
            ))}
          </div>
        ) : (
          <p style={styles.error}>No rides found. Please adjust your search criteria.</p>
        )}
      </div>
    </>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    boxSizing: 'border-box',
    backgroundColor: '#333',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#fff',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 250px)',
    columnGap: '50px',
    rowGap: '20px',
    justifyContent: 'center',
  },
  error: {
    color: '#fff',
    textAlign: 'center',
    fontSize: '1.2rem',
  },
};

export default ChooseRidePage;
