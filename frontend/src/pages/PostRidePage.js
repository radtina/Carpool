// src/pages/PostRidePage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import RoundedInput from '../components/RoundedInput';
import RoundedButton from '../components/RoundedButton';
import ToggleSwitch from '../components/ToggleSwitch';
import Modal from '../components/Modal';
import api from '../services/api';

function PostRidePage() {
  // "To" address states
  const [toQuery, setToQuery] = useState('');
  const [toCoords, setToCoords] = useState({ lat: null, lon: null });
  const [toSuggestions, setToSuggestions] = useState([]);

  // "From" address states
  const [fromQuery, setFromQuery] = useState('');
  const [fromCoords, setFromCoords] = useState({ lat: null, lon: null });
  const [fromSuggestions, setFromSuggestions] = useState([]);

  // Other ride details
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [price, setPrice] = useState('');
  const [seats, setSeats] = useState('');
  const [instantBooking, setInstantBooking] = useState(false);
  const [carType, setCarType] = useState('');

  const [showPostModal, setShowPostModal] = useState(false);
  const navigate = useNavigate();

  // Fetch address suggestions from Nominatim
  const fetchSuggestions = async (query, setSuggestions) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await api.get('https://nominatim.openstreetmap.org/search', {
        params: {
          format: 'json',
          q: query,
          addressdetails: 1,
          limit: 5,
        },
        headers: {
          'Accept-Language': 'en',
        },
      });
      setSuggestions(response.data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    }
  };

  // Handlers for "To" field
  const handleToChange = (e) => {
    const q = e.target.value;
    setToQuery(q);
    fetchSuggestions(q, setToSuggestions);
  };

  const handleToSelect = (suggestion) => {
    setToQuery(suggestion.display_name);
    setToCoords({ 
      lat: parseFloat(suggestion.lat), 
      lon: parseFloat(suggestion.lon) 
    });
    setToSuggestions([]);
  };

  // Handlers for "From" field
  const handleFromChange = (e) => {
    const q = e.target.value;
    setFromQuery(q);
    fetchSuggestions(q, setFromSuggestions);
  };

  const handleFromSelect = (suggestion) => {
    setFromQuery(suggestion.display_name);
    setFromCoords({ 
      lat: parseFloat(suggestion.lat), 
      lon: parseFloat(suggestion.lon) 
    });
    setFromSuggestions([]);
  };

  // Handle form submission: build ride data with confirmed coordinates
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fromCoords.lat || !toCoords.lat) {
      alert('Please select valid addresses for both From and To.');
      return;
    }

    // Combine date and startTime into an ISO-formatted string
    const rideTime = new Date(`${date}T${startTime}:00Z`).toISOString();

    const rideData = {
      from_lat: fromCoords.lat,
      from_lon: fromCoords.lon,
      to_lat: toCoords.lat,
      to_lon: toCoords.lon,
      from_address: fromQuery,   // store the text input
      to_address: toQuery,       // store the text input
      instant_booking: instantBooking,
      price: Number(price),
      ride_time: rideTime,
      available_seats: Number(seats),
      car_type: carType,
    };

    const token = localStorage.getItem('token');

    try {
      const response = await api.post('/rides', rideData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Ride posted successfully:', response.data);
      setShowPostModal(true);
    } catch (error) {
      console.error('Error posting ride:', error);
      alert('Failed to post ride. Please try again.');
    }
  };

  const handleConfirmPost = () => {
    alert("Ride posted!");
    setShowPostModal(false);
    navigate('/find-ride');
  };

  const handleCancelPost = () => {
    setShowPostModal(false);
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h2>Post a Ride</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* 1st Row: "To" & "Price" */}
          <div style={styles.fieldContainer}>
            <RoundedInput
              placeholder="To"
              value={toQuery}
              onChange={handleToChange}
              required
            />
            {toSuggestions.length > 0 && (
              <ul style={styles.suggestionList}>
                {toSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleToSelect(suggestion)}
                    style={styles.suggestionItem}
                  >
                    {suggestion.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <RoundedInput
            placeholder="Price"
            min="0"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          {/* 2nd Row: "From" & "Number of Seats" */}
          <div style={styles.fieldContainer}>
            <RoundedInput
              placeholder="From"
              value={fromQuery}
              onChange={handleFromChange}
              required
            />
            {fromSuggestions.length > 0 && (
              <ul style={styles.suggestionList}>
                {fromSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleFromSelect(suggestion)}
                    style={styles.suggestionItem}
                  >
                    {suggestion.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <RoundedInput
            placeholder="Number of Seats"
            min='1'
            type="number"
            value={seats}
            onChange={(e) => setSeats(e.target.value)}
            required
          />

          {/* 3rd Row: "Date" & "Instant Booking" */}
          <RoundedInput
            placeholder="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <ToggleSwitch
            label="Instant Booking"
            checked={instantBooking}
            onChange={setInstantBooking}
          />

          {/* 4th Row: "Start Time" & "Car Name & Model" */}
          <RoundedInput
            type="time"
            placeholder="Start Time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
          <RoundedInput
            placeholder="Car Name & Model"
            value={carType}
            onChange={(e) => setCarType(e.target.value)}
          />

          {/* Post button across both columns */}
          <RoundedButton type="submit" style={styles.button}>
            Post
          </RoundedButton>
        </form>
      </div>
      <Modal visible={showPostModal} onClose={handleCancelPost}>
        <h3>Confirm Ride Details</h3>
        <p>Are you sure you want to post this ride?</p>
        <div style={styles.modalButtonContainer}>
          <RoundedButton style={styles.button} onClick={handleConfirmPost}>
            Confirm
          </RoundedButton>
          <RoundedButton style={styles.button} onClick={handleCancelPost}>
            Cancel
          </RoundedButton>
        </div>
      </Modal>
    </>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '50px auto',
    padding: '20px',
    boxSizing: 'border-box',
    textAlign: 'center',
  },
  form: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr', // 2 columns
    gap: '15px',
    marginTop: '20px',
  },
  fieldContainer: {
    position: 'relative', // For the dropdown to position absolutely
  },
  suggestionList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    background: '#fff',
    border: '1px solid #ccc',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    zIndex: 1000,
    maxHeight: '200px',
    overflowY: 'auto',
    textAlign: 'left',
  },
  suggestionItem: {
    padding: '8px',
    cursor: 'pointer',
  },
  button: {
    gridColumn: '1 / span 2', // Span both columns
    width: '100%',
    boxSizing: 'border-box',
    marginTop: '10px',
  },
  modalButtonContainer: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
  },
};

export default PostRidePage;
