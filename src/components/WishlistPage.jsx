import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { getToken, getCurrentUser } from '../services/api';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
const API_URL = 'http://localhost:8080/api';

function WishlistPage() {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [scrolled, setScrolled] = useState(false);
    const user = getCurrentUser();
    const token = getToken();
	const theme = useTheme();
	const c = theme.colors;
    useEffect(() => {
        if (user) loadWishlist();
        window.addEventListener('scroll', () => setScrolled(window.scrollY > 50));
        return () => window.removeEventListener('scroll', () => {});
    }, [user]);

    const loadWishlist = async () => {
        try {
            const res = await axios.get(`${API_URL}/wishlist/${user.userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWishlist(res.data || []);
        } catch (err) {} finally { setLoading(false); }
    };

    const removeFromWishlist = async (productId) => {
        try {
            await axios.delete(`${API_URL}/wishlist/${user.userId}/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWishlist(prev => prev.filter(item => item.product?.id !== productId));
        } catch (err) {}
    };

    const addToCart = async (product) => {
        try {
            await axios.post(`${API_URL}/cart`, {
                userId: user.userId,
                product: { id: product.id },
                quantity: 1
            }, { headers: { Authorization: `Bearer ${token}` } });
            alert('Added to cart!');
        } catch (err) { alert('Failed to add to cart'); }
    };

    const getImage = (product) => {
        if (product?.imageUrl?.startsWith('/uploads')) return `http://localhost:8080${product.imageUrl}`;
        const imgs = {
            'Smartphones': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=80',
            'Electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80',
            'Laptops': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80',
            'Fashion': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80',
            'Sports': 'https://images.unsplash.com/photo-1461896836934-bd45ba4fcf69?w=400&q=80',
            'Beauty': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc8?w=400&q=80',
            'Home': 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&q=80',
        };
        return imgs[product?.category] || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400&q=80';
    };

    if (!token) return <Navigate to="/login" />;

    return (
        <div style={{ background: '#faf8ff', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
            
            {/* NAVBAR */}
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
                        <span style={{ fontSize: '20px', fontWeight: '800', color: '#1a0a2e', letterSpacing: '-0.5px' }}>e-shop</span>
                    </Link>
                    <div style={{ display: 'flex', gap: '25px', fontSize: '13px', fontWeight: '500' }}>
                        {['Home', 'Wishlist', 'Cart', 'Orders'].map(l => (
                            <Link key={l} to={`/${l.toLowerCase()}`} style={{
                                color: l === 'Wishlist' ? '#4c1d95' : '#6b7280', textDecoration: 'none',
                                fontWeight: l === 'Wishlist' ? '600' : '500',
                                padding: '6px 12px', borderRadius: '8px', transition: 'all 0.2s',
                            }}
                                onMouseEnter={e => { e.target.style.background = '#f5f0ff'; e.target.style.color = '#4c1d95'; }}
                                onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = l === 'Wishlist' ? '#4c1d95' : '#6b7280'; }}
                            >{l}</Link>
                        ))}
                    </div>
                </div>
            </nav>

            <div style={{ maxWidth: '1300px', margin: '90px auto 50px', padding: '0 30px' }}>

                {/* HEADER */}
                <div style={{ marginBottom: '40px' }}>
                    <p style={{ fontSize: '12px', fontWeight: '700', color: '#7c3aed', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>Saved Items</p>
                    <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#1a0a2e', letterSpacing: '-0.5px', marginBottom: '8px' }}>My Wishlist</h1>
                    <p style={{ color: '#6b7280', fontSize: '15px' }}>{wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved for later</p>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px' }}>
                        <div style={{ width: '44px', height: '44px', border: '3px solid #e9d5ff', borderTopColor: '#7c3aed', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 20px' }}></div>
                        <p style={{ color: '#6b7280', fontSize: '15px' }}>Loading your wishlist...</p>
                    </div>
                ) : wishlist.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '100px 30px', background: '#fff', borderRadius: '24px', border: '1px solid #e9d5ff', boxShadow: '0 10px 40px rgba(76,29,149,0.04)' }}>
                        <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, #fef2f2, #fce4ec)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px', fontSize: '40px' }}>❤️</div>
                        <h3 style={{ color: '#1a0a2e', fontSize: '24px', fontWeight: '700', marginBottom: '10px' }}>Your wishlist is empty</h3>
                        <p style={{ color: '#6b7280', fontSize: '15px', marginBottom: '30px' }}>Save items you love to your wishlist</p>
                        <Link to="/home" style={{
                            padding: '14px 32px', background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', color: '#fff',
                            borderRadius: '12px', textDecoration: 'none', fontWeight: '600', fontSize: '15px',
                            display: 'inline-block', boxShadow: '0 8px 25px rgba(76,29,149,0.2)',
                            transition: 'all 0.3s', fontFamily: "'Inter', sans-serif"
                        }}
                            onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 12px 35px rgba(76,29,149,0.3)'; }}
                            onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 8px 25px rgba(76,29,149,0.2)'; }}
                        >Browse Products</Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '22px' }}>
                        {wishlist.map(item => (
                            <div key={item.id} style={{
                                background: '#fff', borderRadius: '20px', border: '1px solid #e9d5ff',
                                overflow: 'hidden', boxShadow: '0 4px 20px rgba(76,29,149,0.03)',
                                transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)', position: 'relative'
                            }}
                                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 16px 50px rgba(76,29,149,0.12)'}
                                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(76,29,149,0.03)'}>
                                
                                {/* Remove Button */}
                                <button onClick={() => removeFromWishlist(item.product?.id)} style={{
                                    position: 'absolute', top: '14px', right: '14px', zIndex: 2,
                                    width: '34px', height: '34px', borderRadius: '50%', border: 'none',
                                    background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)',
                                    cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    transition: 'all 0.3s', color: '#dc2626'
                                }}
                                    onMouseEnter={e => { e.target.style.background = '#dc2626'; e.target.style.color = '#fff'; }}
                                    onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.9)'; e.target.style.color = '#dc2626'; }}
                                >×</button>

                                {/* Product Image */}
                                <Link to={`/product/${item.product?.id}`}>
                                    <div style={{ height: '260px', overflow: 'hidden', background: '#f5f0ff', position: 'relative' }}>
                                        <img src={getImage(item.product)} alt={item.product?.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s' }} />
                                        {item.product?.stockQuantity <= 5 && item.product?.stockQuantity > 0 && (
                                            <span style={{ position: 'absolute', top: '14px', left: '14px', padding: '5px 12px', background: '#ff9f00', color: '#fff', borderRadius: '8px', fontSize: '11px', fontWeight: '700' }}>Only {item.product.stockQuantity} left</span>
                                        )}
                                    </div>
                                </Link>

                                {/* Info */}
                                <div style={{ padding: '20px' }}>
                                    <span style={{ fontSize: '10px', fontWeight: '700', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '1px' }}>{item.product?.category}</span>
                                    <Link to={`/product/${item.product?.id}`} style={{ textDecoration: 'none' }}>
                                        <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1a0a2e', margin: '6px 0', lineHeight: '1.3' }}>{item.product?.name}</h4>
                                    </Link>
                                    <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '15px', lineHeight: '1.5' }}>
                                        {item.product?.description?.substring(0, 70)}...
                                    </p>
                                    
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '20px', fontWeight: '700', color: '#4c1d95' }}>₹{Number(item.product?.price).toLocaleString()}</span>
                                        <span style={{ fontSize: '12px', fontWeight: '600', color: item.product?.stockQuantity > 0 ? '#059669' : '#dc2626' }}>
                                            {item.product?.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                                        </span>
                                    </div>

                                    <button onClick={() => addToCart(item.product)} disabled={!item.product?.stockQuantity}
                                        style={{
                                            width: '100%', marginTop: '15px', padding: '12px',
                                            background: item.product?.stockQuantity > 0 ? 'linear-gradient(135deg, #4c1d95, #7c3aed)' : '#e9d5ff',
                                            color: item.product?.stockQuantity > 0 ? '#fff' : '#6b7280',
                                            border: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '14px',
                                            cursor: item.product?.stockQuantity > 0 ? 'pointer' : 'not-allowed',
                                            fontFamily: "'Inter', sans-serif", transition: 'all 0.3s',
                                            boxShadow: item.product?.stockQuantity > 0 ? '0 4px 15px rgba(76,29,149,0.15)' : 'none'
                                        }}
                                        onMouseEnter={e => { if(item.product?.stockQuantity) { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 8px 25px rgba(76,29,149,0.25)'; }}}
                                        onMouseLeave={e => { if(item.product?.stockQuantity) { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 15px rgba(76,29,149,0.15)'; }}}
                                    >{item.product?.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <footer style={{ background: '#fff', borderTop: '1px solid #e9d5ff', padding: '20px 30px', textAlign: 'center', fontSize: '12px', color: '#6b7280', fontFamily: "'Inter', sans-serif", marginTop: '60px' }}>
                © 2026 e-shop. All rights reserved.
            </footer>
        </div>
    );
}

export default WishlistPage;