import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerUser } from '../services/api';
import { useTheme } from '../context/ThemeContext';
function Register() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', fullName: '' });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);
	const theme = useTheme();
	const c = theme.colors;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await registerUser(formData);
            setMessage(res.message || 'Account created! You can now sign in.');
            setIsError(false);
            setFormData({ username: '', email: '', password: '', fullName: '' });
        } catch (err) {
            setMessage(err.error || 'Registration failed');
            setIsError(true);
        } finally { setLoading(false); }
    };

    return (
        <div style={s.page}>
            <div style={s.card}>
                {/* LEFT - DARK PURPLE */}
                <div style={s.left}>
                    <div style={s.logo}>e-shop</div>
                    <h1 style={s.heading}>Start your journey.</h1>
                    <p style={s.desc}>Create an account to discover premium products curated for you.</p>
                    <div style={s.features}>
                        <div style={s.fItem}><span style={s.dot}></span>Exclusive member deals</div>
                        <div style={s.fItem}><span style={s.dot}></span>Fast & secure checkout</div>
                        <div style={s.fItem}><span style={s.dot}></span>24/7 premium support</div>
                    </div>
                </div>

                {/* RIGHT - WHITE */}
                <div style={s.right}>
                    <h2 style={s.title}>Create Account</h2>
                    <p style={s.subtitle}>Fill in the details below</p>
                    {message && <div style={isError ? s.error : s.success}>{message}</div>}
                    <form onSubmit={handleSubmit} style={s.form}>
                        <div style={s.inputGroup}>
                            <label style={s.label}>Username</label>
                            <input type="text" placeholder="Choose a username" value={formData.username}
                                onChange={e => setFormData({...formData, username: e.target.value})} required style={s.input} />
                        </div>
                        <div style={s.inputGroup}>
                            <label style={s.label}>Email</label>
                            <input type="email" placeholder="your@email.com" value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})} required style={s.input} />
                        </div>
                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px'}}>
                            <div style={s.inputGroup}>
                                <label style={s.label}>Password</label>
                                <input type="password" placeholder="Min 6 chars" value={formData.password}
                                    onChange={e => setFormData({...formData, password: e.target.value})} required style={s.input} />
                            </div>
                            <div style={s.inputGroup}>
                                <label style={s.label}>Full Name</label>
                                <input type="text" placeholder="John Doe" value={formData.fullName}
                                    onChange={e => setFormData({...formData, fullName: e.target.value})} required style={s.input} />
                            </div>
                        </div>
                        <button type="submit" style={{...s.btn, opacity: loading ? 0.7 : 1}}>
                            {loading ? 'Creating...' : 'Create account'}
                        </button>
                    </form>
                    <p style={s.footer}>Already have an account? <Link to="/login" style={s.link}>Sign in</Link></p>
                </div>
            </div>
        </div>
    );
}

const s = {
    page: {
        minHeight: '100vh',
        background: 'linear-gradient(150deg, #ede4ff 0%, #f5f0ff 50%, #faf8ff 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Inter', sans-serif", padding: '30px 20px'
    },
    card: {
        display: 'flex', background: '#ffffff', borderRadius: '20px', overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(76,29,149,0.12)', width: '900px', maxWidth: '100%', minHeight: '560px'
    },
    left: {
        width: '40%',
        background: 'linear-gradient(160deg, #1a0a2e 0%, #2d1b4e 40%, #4c1d95 100%)',
        padding: '50px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', color: '#ffffff'
    },
    logo: { fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '50px', opacity: '0.9' },
    heading: { fontSize: '32px', fontWeight: '700', lineHeight: '1.2', marginBottom: '16px', letterSpacing: '-0.5px' },
    desc: { fontSize: '14px', lineHeight: '1.7', opacity: '0.7', marginBottom: '40px', fontWeight: '400' },
    features: { display: 'flex', flexDirection: 'column', gap: '14px' },
    fItem: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', opacity: '0.85', fontWeight: '500' },
    dot: { width: '6px', height: '6px', borderRadius: '50%', background: '#a78bfa' },
    right: { width: '60%', padding: '50px 50px', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
    title: { fontSize: '24px', fontWeight: '700', color: '#1a0a2e', marginBottom: '4px' },
    subtitle: { fontSize: '14px', color: '#6b7280', marginBottom: '30px', fontWeight: '400' },
    form: { display: 'flex', flexDirection: 'column', gap: '18px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: '12px', fontWeight: '600', color: '#4c1d95', textTransform: 'uppercase', letterSpacing: '0.5px' },
    input: {
        padding: '12px 16px', borderRadius: '10px', border: '2px solid #e9d5ff',
        outline: 'none', fontSize: '14px', fontFamily: "'Inter', sans-serif",
        background: '#faf8ff', color: '#1a1a1a', boxSizing: 'border-box'
    },
    btn: {
        padding: '14px', background: 'linear-gradient(135deg, #4c1d95, #7c3aed)',
        color: '#ffffff', border: 'none', borderRadius: '10px', fontSize: '15px',
        fontWeight: '600', cursor: 'pointer', fontFamily: "'Inter', sans-serif",
        marginTop: '8px', boxShadow: '0 4px 15px rgba(76,29,149,0.25)'
    },
    error: {
        padding: '12px 16px', borderRadius: '10px', marginBottom: '5px',
        fontSize: '13px', fontWeight: '500', background: '#fef2f2', color: '#dc2626'
    },
    success: {
        padding: '12px 16px', borderRadius: '10px', marginBottom: '5px',
        fontSize: '13px', fontWeight: '500', background: '#ecfdf5', color: '#059669'
    },
    footer: { textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#6b7280' },
    link: { color: '#4c1d95', textDecoration: 'none', fontWeight: '600' }
};

export default Register;