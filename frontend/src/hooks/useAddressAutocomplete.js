// src/hooks/useAddressAutocomplete.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useAddressAutocomplete = (query, delay = 500) => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      axios
        .get('https://nominatim.openstreetmap.org/search', {
          params: {
            format: 'json',
            q: query,
            addressdetails: 1,
            limit: 5,
          },
          headers: {
            'Accept-Language': 'en',
            // Optionally add a User-Agent header per Nominatim guidelines
          },
        })
        .then((response) => {
          setSuggestions(response.data);
        })
        .catch((error) => {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        });
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [query, delay]);

  return suggestions;
};

export default useAddressAutocomplete;
