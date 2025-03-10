// src/pages/ProfilePage.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import RoundedInput from '../components/RoundedInput';
import RoundedButton from '../components/RoundedButton';
import Modal from '../components/Modal';
import api from '../services/api';

function ProfilePage() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    profile_pic: '',
    rating: '',
  });
  const [editPhone, setEditPhone] = useState('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // State for change password
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Fetch user profile when the component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  // Handle profile picture upload
  const handleProfilePicClick = () => {
    fileInputRef.current.click();
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('profile_pic', file);
      try {
        const token = localStorage.getItem('token');
        const response = await api.post('/profile/picture', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        setProfile({ ...profile, profile_pic: response.data.url });
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        alert('Error uploading profile picture. Please try again.');
      }
    }
  };

  // Handle phone update modal
  const handleUpdateProfileOpen = () => {
    setEditPhone(profile.phone);
    setShowUpdateModal(true);
  };

  const handleUpdateProfileSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await api.patch(
        '/profile',
        { phone: editPhone },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile({ ...profile, phone: response.data.phone });
      setShowUpdateModal(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    }
  };

  // Handle change password modal
  const handleChangePasswordOpen = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowChangeModal(true);
  };

  const handleChangePasswordSave = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await api.patch(
        '/profile/password',
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Password changed successfully.');
      setShowChangeModal(false);
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Error changing password. Please try again.');
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h2>My Profile</h2>

        {/* Profile Picture */}
        <div style={styles.picWrapper} onClick={handleProfilePicClick}>
          <img
            src={profile.profile_pic || '/profilepic.svg'}
            alt="Profile"
            style={styles.profilePic}
          />
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleProfilePicChange}
        />

        {/* Profile Details */}
        <RoundedInput value={profile.name} readOnly style={styles.readOnlyInput} />
        <RoundedInput value={profile.email} readOnly style={styles.readOnlyInput} />
        <RoundedInput value={profile.rating} readOnly placeholder="Rating" style={styles.readOnlyInput} />
        <RoundedInput
          type="number"
          placeholder="Phone Number"
          value={profile.phone || ''}
          readOnly
          style={styles.readOnlyInput}
        />

        <RoundedButton onClick={handleUpdateProfileOpen} style={styles.button}>
          Update Phone Number
        </RoundedButton>

        {/* Change Password Button */}
        <RoundedButton onClick={handleChangePasswordOpen} style={styles.button}>
          Change Password
        </RoundedButton>

        <RoundedButton onClick={handleLogout} style={styles.button}>
          Log Out
        </RoundedButton>
      </div>

      {/* Modal for Updating Phone Number */}
      <Modal visible={showUpdateModal} onClose={() => setShowUpdateModal(false)}>
        <h3>Edit Profile</h3>
        <form onSubmit={handleUpdateProfileSave} style={styles.modalForm}>
          <RoundedInput
            placeholder="Phone Number"
            type="tel"
            value={editPhone}
            onChange={(e) => setEditPhone(e.target.value)}
            required
          />
          <div style={styles.modalButtons}>
            <RoundedButton
              type="button"
              onClick={() => setShowUpdateModal(false)}
              style={styles.modalButton}
            >
              Cancel
            </RoundedButton>
            <RoundedButton type="submit" style={styles.modalButton}>
              Save
            </RoundedButton>
          </div>
        </form>
      </Modal>

      {/* Modal for Changing Password */}
      <Modal visible={showChangeModal} onClose={() => setShowChangeModal(false)}>
        <h3>Change Password</h3>
        <form onSubmit={handleChangePasswordSave} style={styles.modalForm}>
          <RoundedInput
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <RoundedInput
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <RoundedInput
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <div style={styles.modalButtons}>
            <RoundedButton
              type="button"
              onClick={() => setShowChangeModal(false)}
              style={styles.modalButton}
            >
              Cancel
            </RoundedButton>
            <RoundedButton type="submit" style={styles.modalButton}>
              Save
            </RoundedButton>
          </div>
        </form>
      </Modal>
    </>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '20px',
    textAlign: 'center',
    boxSizing: 'border-box',
  },
  picWrapper: {
    margin: '0 auto 20px',
    width: '100px',
    height: '100px',
    cursor: 'pointer',
  },
  profilePic: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '50%',
    border: '1px solid #ccc',
  },
  readOnlyInput: {
    marginBottom: '15px',
    backgroundColor: '#f5f5f5',
    cursor: 'not-allowed',
  },
  button: {
    width: '100%',
    marginBottom: '10px',
  },
  modalForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  modalButtons: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  modalButton: {
    width: '45%',
  },
};

export default ProfilePage;
