import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';
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

  // Modal state
  const [showPostModal, setShowPostModal] = useState(false);
  const navigate = useNavigate();

  // Function to fetch suggestions from Nominatim API
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
        headers: { 'Accept-Language': 'en' },
      });
      setSuggestions(response.data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    }
  };

  // Debounced function to reduce API calls on every keystroke.
  const debouncedFetchSuggestions = useCallback(
    debounce((query, setter) => {
      fetchSuggestions(query, setter);
    }, 500),
    []
  );

  // Handlers for "To" field
  const handleToChange = (e) => {
    const q = e.target.value;
    setToQuery(q);
    if (q.length >= 3) {
      debouncedFetchSuggestions(q, setToSuggestions);
    } else {
      setToSuggestions([]);
    }
  };

  const handleToSelect = (suggestion) => {
    setToQuery(suggestion.display_name);
    setToCoords({
      lat: parseFloat(suggestion.lat),
      lon: parseFloat(suggestion.lon),
    });
    setToSuggestions([]);
  };

  // Handlers for "From" field
  const handleFromChange = (e) => {
    const q = e.target.value;
    setFromQuery(q);
    if (q.length >= 3) {
      debouncedFetchSuggestions(q, setFromSuggestions);
    } else {
      setFromSuggestions([]);
    }
  };

  const handleFromSelect = (suggestion) => {
    setFromQuery(suggestion.display_name);
    setFromCoords({
      lat: parseFloat(suggestion.lat),
      lon: parseFloat(suggestion.lon),
    });
    setFromSuggestions([]);
  };

  // Handle form submission for posting a ride
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Ensure that both addresses have been selected (coordinates available)
    if (!fromCoords.lat || !toCoords.lat) {
      alert('Please select valid addresses for both From and To.');
      return;
    }

    // Build the ride data object using snake_case keys to match the backend.
    const rideData = {
      from_lon: fromCoords.lon,
      from_lat: fromCoords.lat,
      to_lon: toCoords.lon,
      to_lat: toCoords.lat,
      from_address: fromQuery,
      to_address: toQuery,
      price: Number(price),
      ride_time: new Date(date + 'T' + startTime + ':00Z'),
      available_seats: Number(seats),
      car_type: carType,
      instant_booking: instantBooking,
    };

    try {
      const response = await api.post('/rides', rideData);
      console.log('Ride posted successfully:', response.data);
      setShowPostModal(true);
    } catch (error) {
      console.error('Error posting ride:', error);
      alert('Failed to post ride. Please try again.');
    }
  };

  const handleConfirmPost = () => {
    alert('Ride posted!');
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
          {/* "To" Field */}
          <div style={styles.inputWrapper}>
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

          {/* Price Field */}
          <RoundedInput
            placeholder="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          {/* "From" Field */}
          <div style={styles.inputWrapper}>
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
            type="number"
            value={seats}
            onChange={(e) => setSeats(e.target.value)}
            required
          />

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
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
    marginTop: '20px',
  },
  button: {
    gridColumn: '1 / span 2',
    width: '100%',
    boxSizing: 'border-box',
  },
  inputWrapper: {
    position: 'relative',
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
  },
  suggestionItem: {
    padding: '8px',
    cursor: 'pointer',
  },
  modalButtonContainer: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
  },
};

export default PostRidePage;
