import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
function Landing() {
    const navigate = useNavigate();
    useEffect(() => {
        const timer = setTimeout(() => navigate('/login'), 3000);
        return () => clearTimeout(timer);
    }, [navigate]);
	const theme = useTheme();
	const c = theme.colors;
    return (
        <div style={s.page}>
            <div style={s.content}>
                <div style={s.logo}>e-shop</div>
                <h1 style={s.title}>Premium Shopping.</h1>
                <p style={s.subtitle}>Discover products curated for your lifestyle.</p>
                <div style={s.loader}><div style={s.loaderBar}></div></div>
            </div>
        </div>
    );
}

const s = {
    page: {
        height: '100vh',
        background: 'linear-gradient(160deg, #1a0a2e 0%, #2d1b4e 40%, #4c1d95 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Inter', sans-serif"
    },
    content: { textAlign: 'center', color: '#ffffff' },
    logo: { fontSize: '24px', fontWeight: '800', letterSpacing: '-0.5px', opacity: '0.8', marginBottom: '40px' },
    title: { fontSize: '52px', fontWeight: '700', letterSpacing: '-1px', marginBottom: '12px' },
    subtitle: { fontSize: '16px', opacity: '0.5', fontWeight: '400', marginBottom: '50px' },
    loader: { width: '120px', height: '2px', background: 'rgba(255,255,255,0.15)', margin: '0 auto', borderRadius: '2px', overflow: 'hidden' },
    loaderBar: { width: '30%', height: '100%', background: '#a78bfa', borderRadius: '2px', animation: 'loadingSlide 2s ease-in-out infinite' }
};

export default Landing;