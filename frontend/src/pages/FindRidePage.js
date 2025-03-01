import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import RoundedInput from '../components/RoundedInput';
import RoundedButton from '../components/RoundedButton';
import api from '../services/api';

function FindRidePage() {
  // "To" address states
  const [toQuery, setToQuery] = useState('');
  const [toCoords, setToCoords] = useState({ lat: null, lon: null });
  const [toSuggestions, setToSuggestions] = useState([]);

  // "From" address states
  const [fromQuery, setFromQuery] = useState('');
  const [fromCoords, setFromCoords] = useState({ lat: null, lon: null });
  const [fromSuggestions, setFromSuggestions] = useState([]);

  // Other form states
  const [date, setDate] = useState('');
  const [time, setTime] = useState(''); // New state for time field
  const [numPeople, setNumPeople] = useState('');

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
    setFromCoords({ lat: suggestion.lat, lon: suggestion.lon });
    setFromSuggestions([]);
  };

  // Perform the search with the selected coordinates
  const performSearch = async (params) => {
    try {
      const response = await api.get('/rides/search', { params });
      navigate('/choose-ride', { state: { rides: response.data } });
    } catch (error) {
      console.error('Error fetching rides:', error);
      alert('Failed to search for rides.');
    }
  };

  // Handle the form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!fromCoords.lat || !toCoords.lat) {
      alert('Please select valid addresses for both From and To.');
      return;
    }
    const params = {
      fromLat: fromCoords.lat,
      fromLon: fromCoords.lon,
      toLat: toCoords.lat,
      toLon: toCoords.lon,
      rideDate: date, // Date from the new date input
      rideTime: time, // New time field value
      numPeople: numPeople,
    };
    await performSearch(params);
  };

  // "Show All" just calls the backend with `{ all: true }`
  const handleShowAll = async () => {
    await performSearch({ all: true });
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h2>Find a Ride</h2>
        <form onSubmit={handleSearch} style={styles.form}>

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

          {/* Date */}
          <RoundedInput
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          {/* Time (New Field) */}
          <RoundedInput
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />

          {/* Number of People */}
          <RoundedInput
            placeholder="Number of people"
            type="number"
            min="1"
            max="10"
            value={numPeople}
            onChange={(e) => setNumPeople(e.target.value)}
            required
          />

          <RoundedButton type="submit" style={styles.button}>
            Search
          </RoundedButton>
        </form>
        <RoundedButton onClick={handleShowAll} style={styles.button}>
          Show All
        </RoundedButton>
      </div>
    </>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '20px',
    boxSizing: 'border-box',
    textAlign: 'center',
  },
  form: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '15px',
    marginTop: '20px',
    textAlign: 'left',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: '5px',
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
  button: {
    width: '100%',
    boxSizing: 'border-box',
    marginTop: '10px',
  },
};

export default FindRidePage;
