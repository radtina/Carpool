// src/components/AddressAutocomplete.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RoundedInput from './RoundedInput'; // Import your reusable component

function AddressAutocomplete({ onAddressSelect }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // Debounce input: wait 500ms after the user stops typing.
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.length > 3) { // Start searching after 3 characters
        fetchSuggestions(query);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const fetchSuggestions = async (q) => {
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          format: 'json',
          q: q,
          addressdetails: 1,
          limit: 5,
        },
        headers: {
          'Accept-Language': 'en',
          // Optionally include a User-Agent header as required by Nominatim usage policy.
        },
      });
      setSuggestions(response.data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleSelect = (suggestion) => {
    setQuery(suggestion.display_name);
    setSuggestions([]);
    // Pass back the confirmed address and coordinates.
    onAddressSelect({
      address: suggestion.display_name,
      lat: suggestion.lat,
      lon: suggestion.lon,
    });
  };

  return (
    <div style={{ position: 'relative' }}>
      <RoundedInput
        type="text"
        placeholder="Enter address"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {suggestions.length > 0 && (
        <ul
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: '#fff',
            listStyle: 'none',
            padding: 0,
            margin: 0,
            border: '1px solid #ccc',
            maxHeight: '200px',
            overflowY: 'auto',
            zIndex: 1000,
          }}
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSelect(suggestion)}
              style={{ padding: '8px', cursor: 'pointer' }}
            >
              {suggestion.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AddressAutocomplete;
