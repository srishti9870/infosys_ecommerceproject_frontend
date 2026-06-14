import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [sent, setSent] = useState(false);
    const theme = useTheme();
    const c = theme.colors;

    const handleSubmit = (e) => {
        e.preventDefault();
        setSent(true);
        setMessage('Password reset link has been sent to your email!');
    };

    return (
        <div style={{ minHeight: '100vh', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif", padding: '20px' }}>
            <div style={{ background: c.card, borderRadius: '20px', padding: '40px', width: '450px', maxWidth: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}>
                
                {sent ? (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '50px', marginBottom: '15px' }}>📧</div>
                        <h2 style={{ color: c.text, marginBottom: '10px', fontSize: '22px' }}>Check Your Email</h2>
                        <p style={{ color: c.text2, fontSize: '14px', marginBottom: '20px' }}>{message}</p>
                        <Link to="/login" style={{ color: '#7c3aed', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>← Back to Login</Link>
                    </div>
                ) : (
                    <>
                        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                            <div style={{ fontSize: '40px', marginBottom: '10px' }}>🔐</div>
                            <h2 style={{ color: c.text, fontSize: '22px', fontWeight: '700', marginBottom: '5px' }}>Forgot Password?</h2>
                            <p style={{ color: c.text2, fontSize: '14px' }}>Enter your email and we'll send you a reset link</p>
                        </div>

                        {message && (
                            <div style={{ padding: '12px', borderRadius: '10px', marginBottom: '15px', fontSize: '13px', background: '#fef2f2', color: '#dc2626', textAlign: 'center' }}>{message}</div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <label style={{ fontSize: '12px', fontWeight: '600', color: c.text, marginBottom: '5px', display: 'block' }}>Email Address</label>
                            <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required
                                style={{ width: '100%', padding: '13px 16px', borderRadius: '10px', border: `2px solid ${c.border}`, outline: 'none', fontSize: '14px', background: c.input, color: c.text, boxSizing: 'border-box', fontFamily: "'Inter', sans-serif", marginBottom: '20px' }} />
                            
                            <button type="submit" style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>
                                Send Reset Link
                            </button>
                        </form>

                        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: c.text2 }}>
                            <Link to="/login" style={{ color: '#7c3aed', textDecoration: 'none', fontWeight: '600' }}>← Back to Login</Link>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}

export default ForgotPassword;