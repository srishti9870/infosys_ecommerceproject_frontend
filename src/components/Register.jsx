import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerUser } from '../services/api';
import { useTheme } from '../context/ThemeContext';

function Register() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '', fullName: '' });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const theme = useTheme();
    const c = theme.colors;

    const checkPasswordStrength = (pass) => {
        let strength = 0;
        if (pass.length >= 6) strength++;
        if (pass.length >= 8) strength++;
        if (/[A-Z]/.test(pass)) strength++;
        if (/[0-9]/.test(pass)) strength++;
        if (/[^A-Za-z0-9]/.test(pass)) strength++;
        setPasswordStrength(strength);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setMessage('Passwords do not match!');
            setIsError(true);
            return;
        }
        if (!agreeTerms) {
            setMessage('Please agree to Terms & Conditions');
            setIsError(true);
            return;
        }

        setLoading(true);
        try {
            const res = await registerUser({
                username: formData.username,
                email: formData.email,
                password: formData.password,
                fullName: formData.fullName
            });
            setMessage(res.message || 'Account created! You can now sign in.');
            setIsError(false);
            setFormData({ username: '', email: '', password: '', confirmPassword: '', fullName: '' });
            setAgreeTerms(false);
            setPasswordStrength(0);
        } catch (err) {
            console.log('Error:', err.response?.data);
            const errorMsg = err.response?.data?.error || err.response?.data || 'Registration failed';
            setMessage(errorMsg);
            setIsError(true);
        } finally { setLoading(false); }
    };

    const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const strengthColors = ['#dc2626', '#f59e0b', '#fbbf24', '#84cc16', '#10b981'];

    const inputStyle = {
        width: '100%', padding: '12px 14px', borderRadius: '10px',
        border: `2px solid ${c.border}`, fontSize: '13px', background: c.input,
        color: c.text, outline: 'none', boxSizing: 'border-box',
        fontFamily: "'Inter', sans-serif"
    };

    return (
        <div style={{ minHeight: '100vh', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif", padding: '20px' }}>
            <div style={{ display: 'flex', background: c.card, borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.1)', width: '950px', maxWidth: '100%' }}>

                {/* LEFT BRANDING */}
				{/* LEFT BRANDING */}
				<div style={{ width: '38%', background: 'linear-gradient(160deg, #1a0a2e, #2d1b4e, #4c1d95)', padding: '50px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', color: '#fff' }}>
				    <div style={{ fontSize: '22px', fontWeight: '800', marginBottom: '50px' }}>e-shop</div>
				    <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '15px' }}>Join us today.</h1>
				    <p style={{ opacity: '0.7', fontSize: '14px', lineHeight: '1.6' }}>Create your account and start shopping for premium products.</p>
				</div>

                {/* RIGHT FORM */}
                <div style={{ width: '62%', padding: '45px 50px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', color: c.text, marginBottom: '5px' }}>Create Account</h2>
                    <p style={{ color: c.text2, fontSize: '14px', marginBottom: '20px' }}>Fill in your details to get started</p>

                    {message && (
                        <div style={{
                            padding: '12px 16px', borderRadius: '10px', marginBottom: '15px', fontSize: '13px',
                            background: isError ? '#fef2f2' : '#ecfdf5',
                            color: isError ? '#dc2626' : '#059669',
                            border: `1px solid ${isError ? '#fecaca' : '#a7f3d0'}`
                        }}>{message}</div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        
                        {/* Row 1: Username + Full Name */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: '600', color: c.text, marginBottom: '4px', display: 'block' }}>Username</label>
                                <input type="text" placeholder="Choose username" value={formData.username}
                                    onChange={e => setFormData({ ...formData, username: e.target.value })} required style={inputStyle} />
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: '600', color: c.text, marginBottom: '4px', display: 'block' }}>Full Name</label>
                                <input type="text" placeholder="John Doe" value={formData.fullName}
                                    onChange={e => setFormData({ ...formData, fullName: e.target.value })} required style={inputStyle} />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label style={{ fontSize: '12px', fontWeight: '600', color: c.text, marginBottom: '4px', display: 'block' }}>Email Address</label>
                            <input type="email" placeholder="your@email.com" value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })} required style={inputStyle} />
                        </div>

                        {/* Password with Strength */}
                        <div>
                            <label style={{ fontSize: '12px', fontWeight: '600', color: c.text, marginBottom: '4px', display: 'block' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <input type={showPassword ? 'text' : 'password'} placeholder="Min 6 characters" value={formData.password}
                                    onChange={e => { setFormData({ ...formData, password: e.target.value }); checkPasswordStrength(e.target.value); }} required
                                    style={{ ...inputStyle, paddingRight: '45px' }} />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: c.text2 }}>
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                            {formData.password && (
                                <div style={{ marginTop: '8px' }}>
                                    <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <div key={i} style={{ flex: 1, height: '4px', borderRadius: '2px', background: i <= passwordStrength ? strengthColors[passwordStrength - 1] || '#e5e7eb' : '#e5e7eb' }}></div>
                                        ))}
                                    </div>
                                    <span style={{ fontSize: '11px', color: strengthColors[passwordStrength - 1] || '#6b7280', fontWeight: '600' }}>
                                        {passwordStrength > 0 ? strengthLabels[passwordStrength - 1] : ''}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label style={{ fontSize: '12px', fontWeight: '600', color: c.text, marginBottom: '4px', display: 'block' }}>Confirm Password</label>
                            <div style={{ position: 'relative' }}>
                                <input type={showConfirm ? 'text' : 'password'} placeholder="Re-enter password" value={formData.confirmPassword}
                                    onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} required
                                    style={{
                                        ...inputStyle, paddingRight: '45px',
                                        border: `2px solid ${formData.confirmPassword && formData.password !== formData.confirmPassword ? '#dc2626' : c.border}`
                                    }} />
                                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: c.text2 }}>
                                    {showConfirm ? '🙈' : '👁️'}
                                </button>
                            </div>
                            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                <span style={{ fontSize: '11px', color: '#dc2626', fontWeight: '600', marginTop: '4px', display: 'block' }}>Passwords do not match</span>
                            )}
                        </div>

                        {/* Terms Checkbox */}
                        <label style={{ display: 'flex', alignItems: 'start', gap: '8px', fontSize: '13px', color: c.text2, cursor: 'pointer', marginTop: '4px' }}>
                            <input type="checkbox" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)}
                                style={{ width: '16px', height: '16px', marginTop: '2px', cursor: 'pointer', accentColor: '#7c3aed', flexShrink: 0 }} />
                            <span>I agree to the <Link to="/terms" style={{ color: '#7c3aed', textDecoration: 'none', fontWeight: '600' }}>Terms & Conditions</Link> and <Link to="/privacy" style={{ color: '#7c3aed', textDecoration: 'none', fontWeight: '600' }}>Privacy Policy</Link></span>
                        </label>

                        {/* Submit */}
                        <button type="submit" disabled={loading} style={{
                            padding: '14px', background: 'linear-gradient(135deg, #4c1d95, #7c3aed)',
                            color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px',
                            fontWeight: '600', cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                            opacity: loading ? 0.7 : 1, marginTop: '4px'
                        }}>
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    {/* Footer */}
                    <p style={{ textAlign: 'center', marginTop: '18px', fontSize: '14px', color: c.text2 }}>
                        Already have an account? <Link to="/login" style={{ color: '#7c3aed', textDecoration: 'none', fontWeight: '600' }}>Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;