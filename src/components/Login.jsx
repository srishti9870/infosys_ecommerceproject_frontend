import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import { signInWithGoogle } from '../firebase';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

function Login() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();
    const theme = useTheme();
    const c = theme.colors;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await loginUser(formData);
            if (rememberMe) {
                localStorage.setItem('rememberedUser', formData.username);
            }
            navigate('/home');
        } catch (error) {
            setMessage(error.error || 'Invalid credentials');
            setIsError(true);
        } finally { setLoading(false); }
    };

	const handleGoogleLogin = async () => {
	    const googleUser = await signInWithGoogle();
	    if (googleUser) {
	        try {
	            const res = await axios.post(`${API_URL}/auth/google`, {
	                email: googleUser.email,
	                name: googleUser.displayName,
	                googleId: googleUser.uid
	            });
	            
	            if (res.data.token) {
	                localStorage.setItem('token', res.data.token);
	                localStorage.setItem('user', JSON.stringify({
	                    userId: res.data.userId,
	                    username: res.data.username,
	                    role: res.data.role || 'USER'
	                }));
	                navigate('/home');
	            }
	        } catch (error) {
	            // Temporary login (agar backend API nahi hai)
	            localStorage.setItem('token', 'google-temp-token');
	            localStorage.setItem('user', JSON.stringify({
	                userId: googleUser.uid,
	                username: googleUser.displayName || googleUser.email.split('@')[0],
	                email: googleUser.email,
	                role: 'USER'
	            }));
	            navigate('/home');
	        }
	    }
	};
    return (
        <div style={{ minHeight: '100vh', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif", padding: '20px' }}>
            <div style={{ display: 'flex', background: c.card, borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.1)', width: '900px', maxWidth: '100%', minHeight: '560px' }}>
                
                {/* LEFT BRAND */}
                <div style={{ width: '40%', background: 'linear-gradient(160deg, #1a0a2e, #2d1b4e, #4c1d95)', padding: '50px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', color: '#fff' }}>
                    <div style={{ fontSize: '22px', fontWeight: '800', marginBottom: '50px' }}>e-shop</div>
                    <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '15px' }}>Welcome back.</h1>
                    <p style={{ opacity: '0.7', fontSize: '14px', lineHeight: '1.6' }}>Sign in to access your account and continue shopping.</p>
                </div>

                {/* RIGHT FORM */}
                <div style={{ width: '60%', padding: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', color: c.text, marginBottom: '5px' }}>Sign In</h2>
                    <p style={{ color: c.text2, fontSize: '14px', marginBottom: '25px' }}>Enter your credentials to continue</p>

                    {message && (
                        <div style={{ padding: '12px 16px', borderRadius: '10px', marginBottom: '15px', fontSize: '13px', background: isError ? '#fef2f2' : '#ecfdf5', color: isError ? '#dc2626' : '#059669', border: `1px solid ${isError ? '#fecaca' : '#a7f3d0'}` }}>{message}</div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{ fontSize: '12px', fontWeight: '600', color: c.text, marginBottom: '5px', display: 'block' }}>Username</label>
                            <input type="text" placeholder="Enter your username" value={formData.username}
                                onChange={e => setFormData({...formData, username: e.target.value})} required
                                style={{ width: '100%', padding: '13px 16px', borderRadius: '10px', border: `2px solid ${c.border}`, outline: 'none', fontSize: '14px', background: c.input, color: c.text, boxSizing: 'border-box', fontFamily: "'Inter', sans-serif" }} />
                        </div>

                        <div>
                            <label style={{ fontSize: '12px', fontWeight: '600', color: c.text, marginBottom: '5px', display: 'block' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={formData.password}
                                    onChange={e => setFormData({...formData, password: e.target.value})} required
                                    style={{ width: '100%', padding: '13px 50px 13px 16px', borderRadius: '10px', border: `2px solid ${c.border}`, outline: 'none', fontSize: '14px', background: c.input, color: c.text, boxSizing: 'border-box', fontFamily: "'Inter', sans-serif" }} />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: c.text2 }}>
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: c.text2, cursor: 'pointer' }}>
                                <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}
                                    style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#7c3aed' }} />
                                Remember me
                            </label>
                            <Link to="/forgot-password" style={{ fontSize: '13px', color: '#7c3aed', textDecoration: 'none', fontWeight: '600' }}>Forgot Password?</Link>
                        </div>

                        <button type="submit" disabled={loading}
                            style={{ padding: '14px', background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Inter', sans-serif", opacity: loading ? 0.7 : 1, marginTop: '8px' }}>
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    {/* DIVIDER */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '20px 0' }}>
                        <div style={{ flex: 1, height: '1px', background: c.border }}></div>
                        <span style={{ fontSize: '12px', color: c.text2, whiteSpace: 'nowrap' }}>or continue with</span>
                        <div style={{ flex: 1, height: '1px', background: c.border }}></div>
                    </div>

                    {/* GOOGLE BUTTON */}
					{/* GOOGLE BUTTON WITH REAL ICON */}
					<button onClick={handleGoogleLogin} type="button" style={{
					    width: '100%', padding: '12px', borderRadius: '10px', border: `2px solid ${c.border}`,
					    background: c.card, cursor: 'pointer', display: 'flex', alignItems: 'center',
					    justifyContent: 'center', gap: '10px', fontSize: '14px', fontWeight: '600',
					    color: c.text, fontFamily: "'Inter', sans-serif", transition: 'all 0.2s'
					}}>
					    <svg width="20" height="20" viewBox="0 0 24 24">
					        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
					        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
					        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
					        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
					    </svg>
					    Continue with Google
					</button>

                    <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: c.text2 }}>
                        Don't have an account? <Link to="/register" style={{ color: '#7c3aed', textDecoration: 'none', fontWeight: '600' }}>Create one</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;