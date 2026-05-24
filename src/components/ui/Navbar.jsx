import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, logoutUser, getToken } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
    const user = getCurrentUser();
    const token = getToken();
    const navigate = useNavigate();
    const theme = useTheme();
    const c = theme.colors;
    const [scrolled, setScrolled] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        window.addEventListener('scroll', () => setScrolled(window.scrollY > 60));
        return () => window.removeEventListener('scroll', () => {});
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) navigate(`/products?search=${searchQuery}`);
    };

    const handleLogout = () => { logoutUser(); navigate('/login'); };

    return (
        <nav style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
            padding: scrolled ? '8px 0' : '16px 0',
            background: scrolled ? c.nav : 'transparent',
            backdropFilter: scrolled ? 'blur(20px)' : 'none',
            boxShadow: scrolled ? c.shadow : 'none',
            borderBottom: scrolled ? `1px solid ${c.border}` : '1px solid transparent',
            transition: 'all 0.4s ease',
            fontFamily: "'Inter', sans-serif",
        }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                
                {/* LOGO */}
                <Link to="/home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: c.primary, color: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '18px' }}>E</div>
                    <span style={{ fontSize: '22px', fontWeight: '800', color: scrolled ? c.text : '#fff', letterSpacing: '-0.5px', transition: 'color 0.3s' }}>e-shop</span>
                </Link>

                {/* SEARCH */}
                <form onSubmit={handleSearch} style={{ flex: '0 1 450px', position: 'relative' }}>
                    <input type="text" placeholder="Search products..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        style={{ width: '100%', padding: '13px 50px 13px 20px', borderRadius: '14px', border: `2px solid ${scrolled ? c.border : 'rgba(255,255,255,0.3)'}`, outline: 'none', fontSize: '14px', fontFamily: "'Inter', sans-serif", background: scrolled ? c.input : 'rgba(255,255,255,0.15)', color: scrolled ? c.text : '#fff', transition: 'all 0.3s', boxSizing: 'border-box' }} />
                    <button type="submit" style={{ position: 'absolute', right: '4px', top: '4px', bottom: '4px', width: '42px', borderRadius: '12px', border: 'none', background: c.primary, color: c.bg, cursor: 'pointer', fontSize: '16px' }}>⌕</button>
                </form>

                {/* RIGHT */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    
                    {/* THEME TOGGLE */}
                    <ThemeToggle />

                    {['Home', 'Wishlist', 'Orders', 'Cart'].map(l => (
                        <Link key={l} to={`/${l.toLowerCase()}`} style={{ color: scrolled ? c.text2 : 'rgba(255,255,255,0.85)', textDecoration: 'none', fontWeight: '500', fontSize: '13px', padding: '9px 15px', borderRadius: '10px', transition: 'all 0.25s' }}
                            onMouseEnter={e => { e.target.style.background = c.hover; e.target.style.color = c.text; }}
                            onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = scrolled ? c.text2 : 'rgba(255,255,255,0.85)'; }}
                        >{l}</Link>
                    ))}
                    
                    {token ? (
                        <div style={{ position: 'relative', marginLeft: '8px' }} onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}>
                            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: c.primary, color: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>{user?.username?.charAt(0).toUpperCase()}</div>
                            {showDropdown && (
                                <div style={{ position: 'absolute', top: '50px', right: 0, background: c.card, borderRadius: '14px', boxShadow: c.shadow, padding: '8px', minWidth: '170px', zIndex: 10, border: `1px solid ${c.border}` }}>
                                    <Link to="/profile" style={dd(c)}>Profile</Link>
                                    <Link to="/orders" style={dd(c)}>Orders</Link>
                                    {user?.role === 'ADMIN' && <Link to="/admin" style={dd(c)}>Admin Panel</Link>}
                                    <div style={{ borderTop: `1px solid ${c.border}`, margin: '4px 0' }}></div>
                                    <span onClick={handleLogout} style={{...dd(c), color: c.danger}}>Logout</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" style={{ marginLeft: '8px', padding: '10px 22px', background: c.primary, color: c.bg, borderRadius: '12px', textDecoration: 'none', fontWeight: '600', fontSize: '13px' }}>Sign In</Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

const dd = (c) => ({ display: 'block', padding: '10px 16px', borderRadius: '10px', color: c.text, textDecoration: 'none', fontSize: '13px', fontWeight: '600' });