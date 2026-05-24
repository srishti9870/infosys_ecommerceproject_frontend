import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { getToken, getCurrentUser, logoutUser } from '../services/api';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
const API_URL = 'http://localhost:8080/api';

function ProfilePage() {
    const user = getCurrentUser();
    const token = getToken();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [message, setMessage] = useState('');
    const [msgType, setMsgType] = useState('success');
    const [scrolled, setScrolled] = useState(false);

    const [profile, setProfile] = useState({ fullName: '', email: '' });
    const [password, setPassword] = useState({ oldPassword: '', newPassword: '' });
	const theme = useTheme();
		const c = theme.colors;

    React.useEffect(() => {
        window.addEventListener('scroll', () => setScrolled(window.scrollY > 50));
        return () => window.removeEventListener('scroll', () => {});
    }, []);

    const handleProfileUpdate = async () => {
        try {
            await axios.put(`${API_URL}/users/profile/${user.userId}`, profile, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Profile updated successfully!');
            setMsgType('success');
        } catch (err) {
            setMessage('Failed to update profile');
            setMsgType('error');
        }
    };

    const handlePasswordUpdate = async () => {
        try {
            await axios.put(`${API_URL}/users/password/${user.userId}`, password, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Password updated! Redirecting to login...');
            setMsgType('success');
            setTimeout(() => { logoutUser(); navigate('/login'); }, 2000);
        } catch (err) {
            setMessage(err.response?.data || 'Failed to update password');
            setMsgType('error');
        }
    };

    const handleLogout = () => { logoutUser(); navigate('/login'); };

    if (!token) return <Navigate to="/login" />;

    const inputStyle = {
        width: '100%', padding: '14px 18px', borderRadius: '12px', border: '2px solid #e9d5ff',
        outline: 'none', fontSize: '14px', fontFamily: "'Inter', sans-serif",
        background: '#faf8ff', color: '#1a0a2e', boxSizing: 'border-box', transition: 'all 0.3s'
    };
    const labelStyle = { fontSize: '13px', fontWeight: '600', color: '#4c1d95', marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' };

    return (
        <div style={{ background: '#faf8ff', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
            
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                padding: scrolled ? '6px 0' : '12px 0',
                background: scrolled ? 'rgba(255,255,255,0.97)' : '#fff',
                backdropFilter: scrolled ? 'blur(20px)' : 'none',
                borderBottom: '1px solid #e9d5ff', transition: 'all 0.3s ease',
            }}>
                <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link to="/home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '15px' }}>E</div>
                        <span style={{ fontSize: '20px', fontWeight: '800', color: '#1a0a2e' }}>e-shop</span>
                    </Link>
                </div>
            </nav>

            <div style={{ maxWidth: '700px', margin: '100px auto 40px', padding: '0 20px' }}>

                {/* Profile Header */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', fontWeight: '800', margin: '0 auto 18px', boxShadow: '0 12px 35px rgba(76,29,149,0.25)' }}>
                        {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1a0a2e', marginBottom: '4px' }}>{user?.username}</h1>
                    <p style={{ color: '#6b7280', fontSize: '14px' }}>Manage your account settings</p>
                </div>

                {/* Tabs */}
                <div style={{ background: '#fff', borderRadius: '16px', padding: '6px', display: 'flex', marginBottom: '25px', border: '1px solid #e9d5ff' }}>
                    {[
                        { id: 'profile', label: 'Profile', icon: '👤' },
                        { id: 'password', label: 'Password', icon: '🔒' },
                    ].map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                            flex: 1, padding: '14px', borderRadius: '12px', border: 'none',
                            background: activeTab === tab.id ? 'linear-gradient(135deg, #4c1d95, #7c3aed)' : 'transparent',
                            color: activeTab === tab.id ? '#fff' : '#6b7280', fontWeight: '700', fontSize: '14px',
                            cursor: 'pointer', fontFamily: "'Inter', sans-serif", transition: 'all 0.3s',
                            boxShadow: activeTab === tab.id ? '0 4px 15px rgba(76,29,149,0.2)' : 'none'
                        }}>{tab.icon} {tab.label}</button>
                    ))}
                </div>

                {message && (
                    <div style={{
                        padding: '16px 20px', borderRadius: '14px', marginBottom: '20px',
                        background: msgType === 'success' ? '#ecfdf5' : '#fef2f2',
                        color: msgType === 'success' ? '#059669' : '#dc2626',
                        fontSize: '14px', fontWeight: '600', textAlign: 'center',
                        border: `1px solid ${msgType === 'success' ? '#a7f3d0' : '#fecaca'}`
                    }}>{message}</div>
                )}

                {activeTab === 'profile' && (
                    <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #e9d5ff', padding: '30px', boxShadow: '0 10px 40px rgba(76,29,149,0.04)' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a0a2e', marginBottom: '25px' }}>Update Profile</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={labelStyle}>Full Name</label>
                                <input type="text" placeholder="Enter your full name" value={profile.fullName}
                                    onChange={e => setProfile({...profile, fullName: e.target.value})} style={inputStyle}
                                    onFocus={e => e.target.style.borderColor = '#7c3aed'} onBlur={e => e.target.style.borderColor = '#e9d5ff'} />
                            </div>
                            <div>
                                <label style={labelStyle}>Email Address</label>
                                <input type="email" placeholder="Enter your email" value={profile.email}
                                    onChange={e => setProfile({...profile, email: e.target.value})} style={inputStyle}
                                    onFocus={e => e.target.style.borderColor = '#7c3aed'} onBlur={e => e.target.style.borderColor = '#e9d5ff'} />
                            </div>
                            <button onClick={handleProfileUpdate} style={{
                                padding: '16px', background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', color: '#fff',
                                border: 'none', borderRadius: '14px', fontWeight: '700', fontSize: '15px', cursor: 'pointer',
                                fontFamily: "'Inter', sans-serif", boxShadow: '0 8px 25px rgba(76,29,149,0.2)', transition: 'all 0.3s'
                            }}
                                onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 12px 35px rgba(76,29,149,0.3)'; }}
                                onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 8px 25px rgba(76,29,149,0.2)'; }}
                            >Save Changes</button>
                        </div>
                    </div>
                )}

                {activeTab === 'password' && (
                    <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #e9d5ff', padding: '30px', boxShadow: '0 10px 40px rgba(76,29,149,0.04)' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a0a2e', marginBottom: '25px' }}>Change Password</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={labelStyle}>Current Password</label>
                                <input type="password" placeholder="Enter current password" value={password.oldPassword}
                                    onChange={e => setPassword({...password, oldPassword: e.target.value})} style={inputStyle}
                                    onFocus={e => e.target.style.borderColor = '#7c3aed'} onBlur={e => e.target.style.borderColor = '#e9d5ff'} />
                            </div>
                            <div>
                                <label style={labelStyle}>New Password</label>
                                <input type="password" placeholder="Min 6 characters" value={password.newPassword}
                                    onChange={e => setPassword({...password, newPassword: e.target.value})} style={inputStyle}
                                    onFocus={e => e.target.style.borderColor = '#7c3aed'} onBlur={e => e.target.style.borderColor = '#e9d5ff'} />
                            </div>
                            <button onClick={handlePasswordUpdate} style={{
                                padding: '16px', background: '#f5f0ff', color: '#4c1d95',
                                border: '2px solid #e9d5ff', borderRadius: '14px', fontWeight: '700', fontSize: '15px', cursor: 'pointer',
                                fontFamily: "'Inter', sans-serif", transition: 'all 0.3s'
                            }}
                                onMouseEnter={e => { e.target.style.background = '#4c1d95'; e.target.style.color = '#fff'; e.target.style.borderColor = '#4c1d95'; }}
                                onMouseLeave={e => { e.target.style.background = '#f5f0ff'; e.target.style.color = '#4c1d95'; e.target.style.borderColor = '#e9d5ff'; }}
                            >Update Password</button>
                        </div>
                    </div>
                )}

                {/* Logout */}
                <div style={{ marginTop: '25px', textAlign: 'center' }}>
                    <button onClick={handleLogout} style={{
                        padding: '14px 40px', background: '#fff', color: '#dc2626',
                        border: '2px solid #fecaca', borderRadius: '14px', fontWeight: '600', fontSize: '14px',
                        cursor: 'pointer', fontFamily: "'Inter', sans-serif", transition: 'all 0.3s'
                    }}
                        onMouseEnter={e => { e.target.style.background = '#fef2f2'; }}
                        onMouseLeave={e => { e.target.style.background = '#fff'; }}
                    >🚪 Logout</button>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;