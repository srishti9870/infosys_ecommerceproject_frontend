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
    const theme = useTheme();
    const c = theme.colors;
    const darkGradient = 'linear-gradient(160deg, #1a0a2e, #2d1b4e, #4c1d95)';

    const [message, setMessage] = useState('');
    const [msgType, setMsgType] = useState('success');
    const [profile, setProfile] = useState({ fullName: '', email: '' });
    const [password, setPassword] = useState({ oldPassword: '', newPassword: '' });

    const handleProfileUpdate = async () => {
        try {
            await axios.put(`${API_URL}/users/profile/${user.userId}`, profile, { headers: { Authorization: `Bearer ${token}` } });
            setMessage('Profile updated successfully');
            setMsgType('success');
        } catch (err) { setMessage('Failed'); setMsgType('error'); }
    };

    const handlePasswordUpdate = async () => {
        try {
            await axios.put(`${API_URL}/users/password/${user.userId}`, password, { headers: { Authorization: `Bearer ${token}` } });
            setMessage('Password updated. Redirecting...');
            setMsgType('success');
            setTimeout(() => { logoutUser(); navigate('/login'); }, 2000);
        } catch (err) { setMessage(err.response?.data || 'Failed'); setMsgType('error'); }
    };

    const handleLogout = () => { logoutUser(); navigate('/login'); };

    if (!token || !user) {
        return (
            <div style={{ background: c.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" }}>
                <div style={{ textAlign: 'center', background: c.card, padding: '50px 40px', borderRadius: '16px', border: `1px solid ${c.border}`, maxWidth: '400px' }}>
                    <h3 style={{ color: c.text, fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>Sign In Required</h3>
                    <p style={{ color: c.text2, fontSize: '14px', marginBottom: '24px' }}>Please login to access your profile</p>
                    <Link to="/login" style={{ padding: '12px 32px', background: darkGradient, color: '#fff', borderRadius: '10px', textDecoration: 'none', fontWeight: '600', fontSize: '14px', display: 'inline-block' }}>Sign In</Link>
                </div>
            </div>
        );
    }

    const inputStyle = {
        width: '100%', padding: '13px 16px', borderRadius: '10px', border: `1.5px solid ${c.border}`,
        outline: 'none', fontSize: '14px', fontFamily: "'Inter', sans-serif", background: c.input,
        color: c.text, boxSizing: 'border-box', transition: 'border-color 0.2s'
    };
    const labelStyle = { fontSize: '12px', fontWeight: '600', color: c.text2, marginBottom: '5px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' };

    const quickLinks = [
        { label: 'My Orders', to: '/orders', icon: '📋', color: '#7c3aed' },
        { label: 'Wishlist', to: '/wishlist', icon: '❤️', color: '#e74c3c' },
        { label: 'Cart', to: '/cart', icon: '🛒', color: '#f59e0b' },
        { label: 'Settings', to: '/profile', icon: '⚙️', color: '#10b981' },
    ];

    const recentActivity = [
        { action: 'Order #1024 placed successfully', time: '2 hours ago', icon: '🛒' },
        { action: 'Password changed', time: 'Yesterday', icon: '🔒' },
        { action: 'Profile information updated', time: '3 days ago', icon: '👤' },
        { action: 'Account created', time: 'January 2026', icon: '🎉' },
    ];

    return (
        <div style={{ background: c.bg, minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: c.text, display: 'flex', flexDirection: 'column' }}>

            {/* HEADER */}
            <div style={{ background: c.card, borderBottom: `1px solid ${c.border}`, padding: '14px 30px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link to="/home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: darkGradient, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '15px' }}>E</div>
                        <span style={{ fontSize: '18px', fontWeight: '700', color: c.text }}>e-shop</span>
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <button onClick={theme.toggleTheme} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: c.text, padding: '6px' }}>
                            {theme.isDark ? '☀️' : '🌙'}
                        </button>
                        {['Home', 'Orders', 'Wishlist'].map(l => (
                            <Link key={l} to={`/${l.toLowerCase()}`} style={{ color: c.text2, textDecoration: 'none', fontSize: '13px', fontWeight: '500' }}>{l}</Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div style={{ flex: 1, maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '40px 30px' }}>

                {/* PROFILE HERO */}
                <div style={{ background: darkGradient, borderRadius: '20px', padding: '40px', display: 'flex', alignItems: 'center', gap: '28px', marginBottom: '30px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', top: '-30%', right: '-15%' }}></div>
                    <div style={{ position: 'relative', zIndex: 1, width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: '3px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', fontWeight: '800', color: '#fff', flexShrink: 0 }}>
                        {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ position: 'relative', zIndex: 1, flex: 1, color: '#fff' }}>
                        <h1 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '4px' }}>{user?.username}</h1>
                        <p style={{ opacity: '0.8', fontSize: '14px' }}>{user?.email || 'No email added'}</p>
                    </div>
                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '10px' }}>
                        <Link to="/orders" style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.2)', color: '#fff', borderRadius: '10px', textDecoration: 'none', fontWeight: '600', fontSize: '13px', backdropFilter: 'blur(10px)' }}>View Orders</Link>
                        <button onClick={handleLogout} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>Sign Out</button>
                    </div>
                </div>

                {/* QUICK LINKS */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '30px' }}>
                    {quickLinks.map(link => (
                        <Link key={link.label} to={link.to} style={{ textDecoration: 'none' }}>
                            <div style={{ background: c.card, borderRadius: '14px', border: `1px solid ${c.border}`, padding: '22px', textAlign: 'center', transition: 'all 0.3s', cursor: 'pointer' }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = link.color; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = c.border; }}>
                                <div style={{ fontSize: '26px', marginBottom: '8px' }}>{link.icon}</div>
                                <p style={{ fontSize: '13px', fontWeight: '600', color: c.text }}>{link.label}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* TWO COLUMNS */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                    <div>
                        <div style={{ background: c.card, borderRadius: '16px', border: `1px solid ${c.border}`, padding: '28px', marginBottom: '25px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: '700', color: c.text, marginBottom: '20px' }}>Personal Information</h3>
                            {message && (
                                <div style={{ padding: '12px 16px', borderRadius: '10px', marginBottom: '18px', fontSize: '13px', background: msgType === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: msgType === 'success' ? '#10b981' : '#ef4444', border: `1px solid ${msgType === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}` }}>{message}</div>
                            )}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div><label style={labelStyle}>Full Name</label><input type="text" placeholder="Your full name" value={profile.fullName} onChange={e => setProfile({...profile, fullName: e.target.value})} style={inputStyle} /></div>
                                <div><label style={labelStyle}>Email</label><input type="email" placeholder="your@email.com" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} style={inputStyle} /></div>
                                <button onClick={handleProfileUpdate} style={{ padding: '12px', background: darkGradient, color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>Save Changes</button>
                            </div>
                        </div>
                        <div style={{ background: c.card, borderRadius: '16px', border: `1px solid ${c.border}`, padding: '28px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: '700', color: c.text, marginBottom: '20px' }}>Security</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div><label style={labelStyle}>Current Password</label><input type="password" placeholder="Enter current password" value={password.oldPassword} onChange={e => setPassword({...password, oldPassword: e.target.value})} style={inputStyle} /></div>
                                <div><label style={labelStyle}>New Password</label><input type="password" placeholder="Minimum 6 characters" value={password.newPassword} onChange={e => setPassword({...password, newPassword: e.target.value})} style={inputStyle} /></div>
                                <button onClick={handlePasswordUpdate} style={{ padding: '12px', background: 'transparent', color: c.text, border: `1.5px solid ${c.border}`, borderRadius: '10px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>Update Password</button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div style={{ background: c.card, borderRadius: '16px', border: `1px solid ${c.border}`, padding: '28px', marginBottom: '25px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: '700', color: c.text, marginBottom: '20px' }}>Recent Activity</h3>
                            {recentActivity.map((item, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: i < recentActivity.length - 1 ? `1px solid ${c.border}` : 'none' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><span style={{ fontSize: '16px' }}>{item.icon}</span><span style={{ fontSize: '14px', color: c.text }}>{item.action}</span></div>
                                    <span style={{ fontSize: '11px', color: c.text2 }}>{item.time}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ background: c.card, borderRadius: '16px', border: `1px solid ${c.border}`, padding: '28px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: '700', color: c.text, marginBottom: '20px' }}>Order Summary</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                {[
                                    { label: 'Total', value: '12', color: '#7c3aed' },
                                    { label: 'Completed', value: '10', color: '#10b981' },
                                    { label: 'Pending', value: '1', color: '#f59e0b' },
                                    { label: 'Cancelled', value: '1', color: '#ef4444' },
                                ].map(s => (
                                    <div key={s.label} style={{ textAlign: 'center', padding: '16px', background: c.bg2, borderRadius: '12px' }}>
                                        <div style={{ fontSize: '22px', fontWeight: '800', color: s.color, marginBottom: '4px' }}>{s.value}</div>
                                        <div style={{ fontSize: '11px', color: c.text2 }}>{s.label}</div>
                                    </div>
                                ))}
                            </div>
                            <Link to="/orders" style={{ display: 'block', textAlign: 'center', marginTop: '16px', fontSize: '13px', color: c.primary, textDecoration: 'none', fontWeight: '600' }}>View All Orders →</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <footer style={{ background: '#0a0a0a', color: '#e9d5ff', padding: '20px 30px', textAlign: 'center', fontSize: '12px', opacity: '0.7', borderTop: `1px solid ${c.border}` }}>
                © 2026 e-shop. All rights reserved.
            </footer>
        </div>
    );
}

export default ProfilePage;