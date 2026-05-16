import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { getToken, getCurrentUser, logoutUser } from '../services/api';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

function ProfilePage() {
    const user = getCurrentUser();
    const token = getToken();
    const navigate = useNavigate();
    
    const [profile, setProfile] = useState({ fullName: '', email: '' });
    const [password, setPassword] = useState({ oldPassword: '', newPassword: '' });
    const [message, setMessage] = useState('');

    const handleProfileUpdate = async () => {
        try {
            const res = await axios.put(`${API_URL}/users/profile/${user.userId}`, profile, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Profile updated!');
        } catch (err) {
            setMessage('Failed to update profile');
        }
    };

    const handlePasswordUpdate = async () => {
        try {
            const res = await axios.put(`${API_URL}/users/password/${user.userId}`, password, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Password updated! Login again.');
            setTimeout(() => { logoutUser(); navigate('/login'); }, 1500);
        } catch (err) {
            setMessage(err.response?.data || 'Failed to update password');
        }
    };

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    if (!token) return <Navigate to="/login" />;

    return (
        <div style={{ background: '#f1f2f4', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
            <div style={{ background: '#2874f0', padding: '15px 30px', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
                <Link to="/home" style={{ color: 'white', textDecoration: 'none', fontSize: '20px', fontWeight: '800' }}>e-shop</Link>
                <span style={{ fontSize: '16px', fontWeight: '600' }}>Profile</span>
            </div>

            <div style={{ maxWidth: '600px', margin: '30px auto', padding: '0 20px' }}>
                {message && (
                    <div style={{ padding: '12px', background: '#E8F5E9', color: '#2E7D32', borderRadius: '4px', marginBottom: '15px', textAlign: 'center', fontSize: '14px' }}>{message}</div>
                )}

                {/* Profile */}
                <div style={{ background: 'white', borderRadius: '4px', padding: '25px', marginBottom: '15px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#212121', marginBottom: '20px' }}>👤 Update Profile</h3>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#555' }}>Full Name</label>
                    <input value={profile.fullName} onChange={e => setProfile({...profile, fullName: e.target.value})} placeholder="Enter full name"
                        style={{ width: '100%', padding: '10px', marginTop: '5px', marginBottom: '12px', borderRadius: '2px', border: '1px solid #e0e0e0', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: "'Inter', sans-serif" }} />
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#555' }}>Email</label>
                    <input value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} placeholder="Enter email"
                        style={{ width: '100%', padding: '10px', marginTop: '5px', marginBottom: '15px', borderRadius: '2px', border: '1px solid #e0e0e0', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: "'Inter', sans-serif" }} />
                    <button onClick={handleProfileUpdate}
                        style={{ width: '100%', padding: '12px', background: '#2874f0', color: 'white', border: 'none', borderRadius: '2px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>
                        Update Profile
                    </button>
                </div>

                {/* Password */}
                <div style={{ background: 'white', borderRadius: '4px', padding: '25px', marginBottom: '15px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#212121', marginBottom: '20px' }}>🔒 Change Password</h3>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#555' }}>Current Password</label>
                    <input type="password" value={password.oldPassword} onChange={e => setPassword({...password, oldPassword: e.target.value})} placeholder="Current password"
                        style={{ width: '100%', padding: '10px', marginTop: '5px', marginBottom: '12px', borderRadius: '2px', border: '1px solid #e0e0e0', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: "'Inter', sans-serif" }} />
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#555' }}>New Password</label>
                    <input type="password" value={password.newPassword} onChange={e => setPassword({...password, newPassword: e.target.value})} placeholder="Min 6 characters"
                        style={{ width: '100%', padding: '10px', marginTop: '5px', marginBottom: '15px', borderRadius: '2px', border: '1px solid #e0e0e0', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: "'Inter', sans-serif" }} />
                    <button onClick={handlePasswordUpdate}
                        style={{ width: '100%', padding: '12px', background: '#ff9f00', color: 'white', border: 'none', borderRadius: '2px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>
                        Update Password
                    </button>
                </div>

                {/* Logout */}
                <button onClick={handleLogout}
                    style={{ width: '100%', padding: '14px', background: '#FFF3F3', color: '#e74c3c', border: '1px solid #FFCDD2', borderRadius: '2px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>
                    🚪 Logout
                </button>
            </div>
        </div>
    );
}

export default ProfilePage;