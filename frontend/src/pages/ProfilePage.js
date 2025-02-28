// src/pages/ProfilePage.js
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import RoundedInput from '../components/RoundedInput';
import RoundedButton from '../components/RoundedButton';
import api from '../services/api';

function ProfilePage() {
  const navigate = useNavigate();

  // Profile data from backend
  const [profile_pic, setProfilePic] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Hidden file input for profile picture upload
  const fileInputRef = useRef(null);

  // Modal states
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false);

  // Only editable field: phone
  const [editPhone, setEditPhone] = useState('');

  // Password change fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setName(response.data.name || '');
        setEmail(response.data.email || '');
        setPhone(response.data.phone || '');
        setProfilePic(response.data.profile_pic || ''); // fetch persisted profile pic URL
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  // Upload and update profile picture
  const handleProfilePicClick = () => {
    fileInputRef.current.click();
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('profile_pic', file);
      const token = localStorage.getItem('token');
      try {
        const uploadResponse = await api.post('/profile/picture', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Upload response:", uploadResponse.data);
        // Re-fetch the profile after successful upload
        const profileResponse = await api.get('/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Re-fetched profile:", profileResponse.data);
        setProfilePic(profileResponse.data.profile_pic);
      } catch (err) {
        console.error('Error uploading profile picture:', err);
        alert('Error uploading profile picture. Please try again.');
      }
    }
  };
  
  

  // Open modal to update phone number
  const handleUpdateProfileOpen = () => {
    setEditPhone(phone);
    setShowUpdateModal(true);
  };

  // Save updated phone via PATCH /profile (only phone is updated)
  const handleUpdateProfileSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await api.patch(
        '/profile',
        { phone: editPhone.trim() || '' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPhone(response.data.phone || '');
      setShowUpdateModal(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    }
  };

  // Open change password modal
  const handleChangePasswordOpen = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowChangeModal(true);
  };

  // Save changed password via PATCH /profile/password
  const handleChangePasswordSave = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
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

  // Log out
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>My Profile</h2>

        {/* Profile Picture */}
        <div style={styles.picWrapper} onClick={handleProfilePicClick}>
        <img src={profile_pic || '/profilepic.svg'} alt="Profile" style={styles.profilepic} />
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleProfilePicChange}
          style={{ display: 'none' }}
        />

        {/* Display fields: Name, Email, Phone */}
        <RoundedInput value={name} readOnly style={styles.readOnlyInput} />
        <RoundedInput value={email} readOnly style={styles.readOnlyInput} />
        <RoundedInput value={phone} readOnly style={styles.readOnlyInput} />

        {/* Action Buttons */}
        <RoundedButton onClick={handleChangePasswordOpen} style={styles.button}>
          Change Password
        </RoundedButton>
        <RoundedButton onClick={handleUpdateProfileOpen} style={styles.button}>
          Update Phone Number
        </RoundedButton>
        <RoundedButton onClick={handleLogout} style={styles.button}>
          Log Out
        </RoundedButton>
      </div>

      {/* Update Phone Number Modal */}
      <Modal visible={showUpdateModal} onClose={() => setShowUpdateModal(false)}>
        <h3>Edit Profile</h3>
        <form onSubmit={handleUpdateProfileSave} style={styles.modalForm}>
          <RoundedInput placeholder="Name" value={name} readOnly />
          <RoundedInput type="email" placeholder="Email" value={email} readOnly />
          <RoundedInput
            type="number"
            placeholder="Phone (numbers only, optional)"
            value={editPhone}
            onChange={(e) => setEditPhone(e.target.value)}
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

      {/* Change Password Modal */}
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
  title: {
    marginBottom: '20px',
  },
  picWrapper: {
    margin: '0 auto 20px',
    width: '100px',
    height: '100px',
    cursor: 'pointer',
  },
  profilepic: {
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
