import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerUser } from '../services/api';

function Register() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', fullName: '' });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await registerUser(formData);
            setMessage(response.message || 'Account created successfully! You can now login.');
            setIsError(false);
            setFormData({ username: '', email: '', password: '', fullName: '' });
        } catch (error) {
            setMessage(error.error || 'Registration failed!');
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                {/* LEFT SIDE */}
                <div style={styles.left}>
                    <Link to="/home" style={{ textDecoration: 'none', color: 'white' }}>
                        <span style={{ fontSize: '42px' }}>🛍️</span>
                    </Link>
                    <h2 style={{ fontSize: '26px', fontWeight: '800', margin: '15px 0 5px', letterSpacing: '-0.5px' }}>e-shop</h2>
                    <p style={{ fontSize: '13px', opacity: '0.85', lineHeight: '1.6' }}>
                        Join millions of shoppers. Sign up today!
                    </p>
                </div>

                {/* RIGHT SIDE */}
                <div style={styles.right}>
                    <h3 style={styles.title}>Create Account</h3>
                    <p style={styles.subtitle}>Fill in your details to get started</p>
                    
                    {message && (
                        <div style={isError ? styles.errorBox : styles.successBox}>{message}</div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div>
                            <label style={styles.label}>Username</label>
                            <input type="text" placeholder="Choose a username" value={formData.username}
                                onChange={e => setFormData({...formData, username: e.target.value})}
                                required style={styles.input} />
                        </div>
                        <div>
                            <label style={styles.label}>Email</label>
                            <input type="email" placeholder="Enter your email" value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                                required style={styles.input} />
                        </div>
                        <div>
                            <label style={styles.label}>Password</label>
                            <input type="password" placeholder="Min 6 characters" value={formData.password}
                                onChange={e => setFormData({...formData, password: e.target.value})}
                                required style={styles.input} />
                        </div>
                        <div>
                            <label style={styles.label}>Full Name</label>
                            <input type="text" placeholder="Enter your full name" value={formData.fullName}
                                onChange={e => setFormData({...formData, fullName: e.target.value})}
                                required style={styles.input} />
                        </div>
                        <button type="submit" style={loading ? {...styles.btn, opacity: 0.7} : styles.btn}>
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </form>

                    <p style={styles.footer}>
                        Already have an account? <Link to="/login" style={styles.link}>Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: '100vh',
        background: '#f1f2f4',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        padding: '20px'
    },
    card: {
        display: 'flex',
        background: '#ffffff',
        borderRadius: '4px',
        overflow: 'hidden',
        boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
        width: '850px',
        minHeight: '520px'
    },
    left: {
        width: '38%',
        background: 'linear-gradient(160deg, #1B56C9 0%, #2874f0 50%, #3D8BFD 100%)',
        padding: '50px 35px',
        color: 'white',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    right: {
        width: '62%',
        padding: '45px 55px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    title: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#212121',
        marginBottom: '5px'
    },
    subtitle: {
        color: '#878787',
        fontSize: '14px',
        marginBottom: '25px'
    },
    label: {
        display: 'block',
        fontSize: '13px',
        fontWeight: '600',
        color: '#333',
        marginBottom: '6px'
    },
    input: {
        width: '100%',
        padding: '13px 16px',
        fontSize: '14px',
        borderRadius: '2px',
        border: '2px solid #e0e0e0',
        outline: 'none',
        backgroundColor: '#fafafa',
        boxSizing: 'border-box',
        fontFamily: "'Inter', sans-serif"
    },
    btn: {
        width: '100%',
        padding: '14px',
        background: '#2874f0',
        color: 'white',
        border: 'none',
        borderRadius: '2px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '8px',
        fontFamily: "'Inter', sans-serif"
    },
    errorBox: {
        padding: '12px 16px',
        backgroundColor: '#FFF3F3',
        color: '#C62828',
        borderRadius: '2px',
        fontSize: '13px',
        marginBottom: '18px',
        border: '1px solid #FFCDD2'
    },
    successBox: {
        padding: '12px 16px',
        backgroundColor: '#E8F5E9',
        color: '#2E7D32',
        borderRadius: '2px',
        fontSize: '13px',
        marginBottom: '18px',
        border: '1px solid #C8E6C9'
    },
    footer: {
        textAlign: 'center',
        marginTop: '25px',
        fontSize: '14px',
        color: '#878787'
    },
    link: {
        color: '#2874f0',
        textDecoration: 'none',
        fontWeight: '600'
    }
};

export default Register;