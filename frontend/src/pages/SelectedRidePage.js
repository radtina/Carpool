// src/pages/SelectedRidePage.js
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import RoundedButton from '../components/RoundedButton';
import Modal from '../components/Modal';

function SelectedRidePage() {
  const location = useLocation();
  const ride = location.state?.ride;
  const [showBookingModal, setShowBookingModal] = useState(false);

  if (!ride) {
    return (
      <>
        <Navbar />
        <div style={styles.noRideContainer}>
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

  // Format ride time (for starting time) and ETA (arrival time)
  const formattedRideTime = ride.ride_time
  ? `${new Date(ride.ride_time).toLocaleDateString()} ${new Date(ride.ride_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  : '';
  //const formattedETA = ride.eta; // Assuming ETA is a string; otherwise, format as needed

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.card}>
          {/* Top Row: Driver info */}
          <div style={styles.topRow}>
            <div style={styles.driverInfo}>
              <img
                src="/profilepic.svg"
                alt="Driver"
                style={styles.profilePic}
              />
              <span style={styles.driverName}>{ride.driver_name}</span>
            </div>
            <div style={styles.rating}>{ride.driver_rating} ★</div>
          </div>

          {/* Middle Section: Starting point and destination */}
          <div style={styles.infoSection}>
            {/* Starting point */}
            <div style={styles.infoBlock}>

              <span style={styles.address}>{ride.from_address}</span>
              <span style={styles.time}>{formattedRideTime}</span>
            </div>

            {/* Middle row: arrow or dash indicating going from -> to */}
            <div style={styles.row}>
              <div style={styles.arrow}>
              ⋮
              </div>
            </div>

            {/* Destination */}
            <div style={styles.infoBlock}>
              <span style={styles.address}>{ride.to_address}</span>
              <span style={styles.time}>{ride.eta ? ride.eta : 'N/A'}</span>
            </div>
          </div>

          {/* Bottom Section: Car info and Price */}
          <div style={styles.bottomRow}>
            <div style={styles.carInfo}>
              <img src="/caricon.svg" alt="Car" style={styles.carIcon} />
              <span style={styles.carType}>{ride.car_type}</span>
            </div>
            <div style={styles.priceContainer}>
              <span style={styles.price}>{ride.price} €</span>
            </div>
          </div>

          {/* Button Row */}
          <div style={styles.buttonRow}>
            <RoundedButton style={styles.bookButton} onClick={handleBookClick}>
              Book
            </RoundedButton>
            <RoundedButton style={styles.msgButton}>
              Message
            </RoundedButton>
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
  // Full-page container with background image
  container: {
    width: '100%',
    minHeight: '100vh',
    padding: '40px 20px',
    boxSizing: 'border-box',
    background: "url('/background.jpg') center center / cover no-repeat",
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    backgroundBlendMode: 'darken',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noRideContainer: {
    width: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    background: "url('/background.jpg') center center / cover no-repeat",
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    backgroundBlendMode: 'darken',
  },
  card: {
    width: '550px',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(8px)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    padding: '30px',
    boxSizing: 'border-box',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  driverInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  profilePic: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #ccc',
  },
  driverName: {
    fontSize: '1.3rem',
    fontWeight: '600',
  },
  rating: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
  },
  infoSection: {
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  infoBlock: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '1.3rem',
    fontWeight: '600',
    marginBottom: '3px',
  },
  address: {
    fontSize: '1.1rem',
    fontWeight: '500',
  },
  time: {
    fontSize: '1rem',
    opacity: 0.8,
  },
  bottomRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '20px',
    marginBottom: '5px',
  },
  carInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  carIcon: {
    width: '40px',
    height: '40px',
  },
  carType: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
  },
  priceContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flex: 1,
  },
  price: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
  },
  buttonRow: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
  },
  bookButton: {
    flex: 1,
  },
  msgButton: {
    flex: 1,
  },
  arrow: {
    fontSize: '1.5rem',
    color: '#fff',
    opacity: 0.7,
    textAlign: 'center',
    width: '10%',
  },
  modalButtonContainer: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
  },
};

export default SelectedRidePage;
