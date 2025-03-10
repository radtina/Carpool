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
                driver_rating={ride.driver_rating}
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
    width: '100%',
    minHeight: '100vh',
    padding: '40px 20px',
    background: "url('/background.jpg') center center / cover no-repeat",
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    backgroundBlendMode: 'darken',
    boxSizing: 'border-box',
  },
  title: {
    textAlign: 'center',
    marginBottom: '40px',
    color: '#fff',

  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, 300px)',
    columnGap: '50px',
    rowGap: '50px',
    justifyContent: 'center',
  },
  error: {
    color: '#fff',
    textAlign: 'center',
    fontSize: '1.2rem',
  },
};

export default ChooseRidePage;
