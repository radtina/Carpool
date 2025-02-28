// src/components/RoundedButton.js
import React from 'react';

function RoundedButton({
  children,
  onClick,
  type = 'button',
  style = {},
  ...rest
}) {
  const mergedStyles = { ...styles.button, ...style };

  return (
    <button type={type} onClick={onClick} style={mergedStyles} {...rest}>
      {children}
    </button>
  );
}

const styles = {
  button: {
    padding: '12px',
    fontSize: '16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#ff4c4c',
    color: '#fff',
    cursor: 'pointer',
    // Add more default styles as needed
  },
};

export default RoundedButton;
