import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Landing() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/login');
        }, 2500);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div style={styles.page}>
            <div style={styles.content}>
                <div style={styles.logoBox}>
                    <span style={styles.logoIcon}>🛍️</span>
                </div>
                <h1 style={styles.brand}>E-SHOP</h1>
                <div style={styles.divider}></div>
                <p style={styles.quote}>"Shopping made simple, style made yours."</p>
                <div style={styles.loader}>
                    <div style={styles.loaderBar}></div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: {
        height: '100vh',
        background: 'linear-gradient(160deg, #7c5cbf 0%, #a78bfa 50%, #c4b5fd 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', sans-serif"
    },
    content: {
        textAlign: 'center',
        color: 'white'
    },
    logoBox: {
        width: '120px',
        height: '120px',
        background: 'rgba(255,255,255,0.2)',
        borderRadius: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 25px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
    },
    logoIcon: {
        fontSize: '55px'
    },
    brand: {
        fontSize: '42px',
        fontWeight: '900',
        letterSpacing: '4px',
        margin: '0 0 20px 0'
    },
    divider: {
        width: '60px',
        height: '3px',
        background: 'rgba(255,255,255,0.6)',
        margin: '0 auto 20px',
        borderRadius: '2px'
    },
    quote: {
        fontSize: '16px',
        opacity: '0.9',
        fontStyle: 'italic',
        fontWeight: '300',
        marginBottom: '40px',
        letterSpacing: '1px'
    },
    loader: {
        width: '150px',
        height: '3px',
        background: 'rgba(255,255,255,0.3)',
        borderRadius: '2px',
        margin: '0 auto',
        overflow: 'hidden'
    },
    loaderBar: {
        width: '40%',
        height: '100%',
        background: 'white',
        borderRadius: '2px',
        animation: 'loading 1.5s ease-in-out infinite'
    }
};

export default Landing;