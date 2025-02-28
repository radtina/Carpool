// src/pages/SelectedRidePage.js
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import RoundedButton from '../components/RoundedButton';
import Modal from '../components/Modal';

function SelectedRidePage() {
  const location = useLocation();
  const ride = location.state?.ride; // The ride data passed from ChooseRidePage
  const [showBookingModal, setShowBookingModal] = useState(false);

  if (!ride) {
    return (
      <>
        <Navbar />
        <div style={styles.container}>
          <h2>No ride data available</h2>
        </div>
      </>
    );
  }

  const handleBookClick = () => {
    setShowBookingModal(true);
  };

  const handleConfirmBooking = () => {
    alert('Ride booked!');
    setShowBookingModal(false);
  };

  const handleCancelBooking = () => {
    setShowBookingModal(false);
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>Selected Ride Details</h2>
        <div style={styles.card}>
          {/* Row 1: Driver pic, name, rating */}
          <div style={styles.topRow}>
            <div style={styles.name}>
              <img
                src="/profilepic.svg"
                alt="Driver"
                style={styles.profilePic}
              />
              <span>{ride.driver_name}</span>
            </div>
            <div style={styles.rating}>{ride.rating} ★</div>
          </div>

          {/* Row 2: City + Start Time */}
          <div style={styles.row}>
            <span style={styles.cityText}>
              {ride.from_address}
              <span style={styles.spacing} />
              {ride.ride_time}
            </span>
          </div>

          {/* Row 3: Arrow on the left */}
          <div style={styles.arrowRow}>
            <span style={styles.arrow}>↓</span>
          </div>

          {/* Row 4: Destination city + ETA */}
          <div style={styles.row}>
            <span style={styles.cityText}>
              {ride.to_address}
              <span style={styles.spacing} />
              {ride.eta}
            </span>
          </div>

          {/* Row 5: Car icon, car type, and price all together */}
          <div style={styles.topRow}>
            <div style={styles.carInfo}>
              <img src="/caricon.svg" alt="Car" style={styles.carIcon} />
              <span style={styles.carType}>{ride.carType}</span>
            </div>
            <div>
              <span style={styles.price}>{ride.price} €</span>
            </div>
          </div>

          {/* Row 6: Book & Message buttons */}
          <div style={styles.buttonContainer}>
            <RoundedButton style={styles.bookButton} onClick={handleBookClick}>
              Book
            </RoundedButton>
            <RoundedButton style={styles.msgButton}>Message</RoundedButton>
          </div>
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      <Modal visible={showBookingModal} onClose={handleCancelBooking}>
        <h3>Confirm Booking</h3>
        <p>Are you sure you want to book this ride?</p>
        <div style={styles.modalButtonContainer}>
          <RoundedButton style={styles.bookButton} onClick={handleConfirmBooking}>
            Confirm
          </RoundedButton>
          <RoundedButton style={styles.bookButton} onClick={handleCancelBooking}>
            Cancel
          </RoundedButton>
        </div>
      </Modal>
    </>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '20px',
    boxSizing: 'border-box',
    backgroundColor: '#333',
    textAlign: 'center',
    color: '#fff',
    borderRadius: '8px',
  },
  title: {
    marginBottom: '30px',
  },
  card: {
    border: '1px solid #fff',
    borderRadius: '8px',
    padding: '20px',
    boxSizing: 'border-box',
    textAlign: 'left',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  name: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  profilePic: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '1px solid #ccc',
  },
  rating: {
    fontWeight: 'bold',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  arrowRow: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginBottom: '10px',
  },
  arrow: {
    fontSize: '24px',
    marginLeft: '10px',
  },
  cityText: {
    fontSize: '1rem',
    fontWeight: 'normal',
  },
  spacing: { // Adds space between city and time
    display: 'inline-block',
    width: '10px',
  },
  carInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
  },
  carIcon: {
    width: '30px',
    height: '30px',
  },
  carType: {
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  price: {
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  buttonContainer: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
  },
  bookButton: {
    flex: 1,
  },
  msgButton: {
    flex: 1,
    backgroundColor: '#fff',
    color: '#000',
  },
  modalButtonContainer: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
  },
};

export default SelectedRidePage;
