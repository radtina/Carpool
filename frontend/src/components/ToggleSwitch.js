// src/components/ToggleSwitch.js
import React from 'react';

function ToggleSwitch({ label, checked, onChange }) {
  const handleClick = () => {
    onChange(!checked);
  };

  return (
    <div style={styles.container}>
      <span>{label}</span>
      <div
        style={{
          ...styles.switchBase,
          backgroundColor: checked ? '#2196F3' : '#ccc',
        }}
        onClick={handleClick}
      >
        <div
          style={{
            ...styles.circle,
            transform: checked ? 'translateX(26px)' : 'translateX(0)',
          }}
        />
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: '8px',
    border: '1px solid #ccc',
    padding: '10px',
    boxSizing: 'border-box',
  },
  switchBase: {
    position: 'relative',
    width: '50px',
    height: '24px',
    borderRadius: '24px',
    cursor: 'pointer',
    transition: 'background-color 0.4s',
  },
  circle: {
    position: 'absolute',
    top: '3px',
    left: '3px',
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    backgroundColor: '#fff',
    transition: 'transform 0.4s',
  },
};

export default ToggleSwitch;
