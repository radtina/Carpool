// src/components/RoundedInput.js
import React from 'react';

function RoundedInput({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  required = false,
  style = {},
  ...rest
}) {
  // Merge custom style props with default styles
  const mergedStyles = { ...styles.input, ...style };

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      style={mergedStyles}
      {...rest}
    />
  );
}

const styles = {
  input: {
    boxSizing: 'border-box',
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    outline: 'none',
    // Add any other default styles you want
  },
};

export default RoundedInput;
