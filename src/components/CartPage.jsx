import React, { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { getToken, getCurrentUser } from '../services/api';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';

const API_URL = 'http://localhost:8080/api';

function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [scrolled, setScrolled] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [promoCode, setPromoCode] = useState('');
    const [promoApplied, setPromoApplied] = useState(false);
    const [recommended, setRecommended] = useState([]);
    
    const user = getCurrentUser();
    const token = getToken();
    const navigate = useNavigate();
    const theme = useTheme();
    const c = theme.colors;
    const darkGradient = 'linear-gradient(160deg, #1a0a2e, #2d1b4e, #4c1d95)';

    useEffect(() => {
        if (user) {
            loadCart();
            loadRecommended();
        }
        window.addEventListener('scroll', () => setScrolled(window.scrollY > 60));
        return () => window.removeEventListener('scroll', () => {});
    }, [user]);

    const loadCart = async () => {
        try {
            const res = await axios.get(`${API_URL}/cart/${user.userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCartItems(res.data || []);
        } catch (err) {} finally { setLoading(false); }
    };

    const loadRecommended = async () => {
        try {
            const res = await axios.get(`${API_URL}/products?page=0&size=4`);
            const data = res.data.products || res.data || [];
            setRecommended(Array.isArray(data) ? data.slice(0, 4) : []);
        } catch (err) {}
    };

    const removeItem = async (id) => {
        await axios.delete(`${API_URL}/cart/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        loadCart();
    };

    const updateQty = async (id, newQty) => {
        if (newQty < 1) return;
        await axios.put(`${API_URL}/cart/${id}`, { quantity: newQty }, { headers: { Authorization: `Bearer ${token}` } });
        loadCart();
    };

    const applyPromo = () => {
        if (promoCode.toUpperCase() === 'WELCOME10') {
            setPromoApplied(true);
        } else {
            alert('Invalid promo code');
        }
    };

    const subtotal = cartItems.reduce((s, i) => s + (i.product?.price * i.quantity), 0);
    const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
    const delivery = subtotal > 500 ? 0 : 50;
    const total = subtotal - discount + delivery;

    const handleLogout = () => { localStorage.clear(); window.location.href = '/login'; };
    const handleSearch = (e) => { e.preventDefault(); if (searchQuery.trim()) navigate(`/products?search=${searchQuery}`); };

    const getImage = (product) => {
        if (product?.imageUrl?.startsWith('/uploads')) return `http://localhost:8080${product.imageUrl}`;
        const imgs = {
            'Smartphones': '/images/smartphones.jpg',
            'Laptops': '/images/laptop.jpg',
            'Audio': '/images/audio.jpg',
            'Wearables': '/images/wearables.jpg',
            'Fashion': '/images/fashion.jpg',
            'Sports': '/images/sports.jpg',
        };
        return imgs[product?.category] || '/images/default.jpg';
    };

    if (!token) return <Navigate to="/login" />;

    return (
        <div style={{ background: c.bg, minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: c.text }}>

            {/* NAVBAR */}
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
                padding: scrolled ? '6px 0' : '14px 0',
                background: scrolled ? 'rgba(255,255,255,0.95)' : '#fff',
                backdropFilter: scrolled ? 'blur(30px) saturate(180%)' : 'none',
                boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.06)' : 'none',
                borderBottom: `1px solid ${c.border}`,
                transition: 'all 0.4s ease',
            }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    
                    <Link to="/home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: darkGradient, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '19px', boxShadow: '0 8px 25px rgba(76,29,149,0.3)' }}>E</div>
                        <div>
                            <span style={{ fontSize: '22px', fontWeight: '800', color: c.text, letterSpacing: '-0.5px', display: 'block', lineHeight: '1.1' }}>e-shop</span>
                            <span style={{ fontSize: '9px', fontWeight: '600', color: c.primary, letterSpacing: '3px', textTransform: 'uppercase' }}>Premium Store</span>
                        </div>
                    </Link>

                    <form onSubmit={handleSearch} style={{ flex: '0 1 400px', position: 'relative' }}>
                        <input type="text" placeholder="Search products..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                            style={{ width: '100%', padding: '12px 50px 12px 18px', borderRadius: '12px', border: `2px solid ${c.border}`, outline: 'none', fontSize: '14px', fontFamily: "'Inter', sans-serif", background: c.input, color: c.text, boxSizing: 'border-box' }} />
                        <button type="submit" style={{ position: 'absolute', right: '4px', top: '4px', bottom: '4px', width: '38px', borderRadius: '10px', border: 'none', background: darkGradient, color: '#fff', cursor: 'pointer' }}>⌕</button>
                    </form>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <button onClick={theme.toggleTheme} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', padding: '8px 10px', color: c.text }}>{theme.isDark ? '☀️' : '🌙'}</button>
                        {['Home', 'Wishlist', 'Orders'].map(l => (
                            <Link key={l} to={`/${l.toLowerCase()}`} style={{ color: l === 'Cart' ? c.primary : c.text2, textDecoration: 'none', fontWeight: l === 'Cart' ? '600' : '500', fontSize: '14px', padding: '10px 16px', borderRadius: '10px', transition: 'all 0.2s' }}
                                onMouseEnter={e => { e.target.style.background = c.hover; }}
                                onMouseLeave={e => { e.target.style.background = 'transparent'; }}>{l}</Link>
                        ))}
                        {user && (
                            <div style={{ position: 'relative', marginLeft: '8px' }} onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: darkGradient, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>{user?.username?.charAt(0).toUpperCase()}</div>
                                {showDropdown && (
                                    <div style={{ position: 'absolute', top: '44px', right: 0, background: c.card, borderRadius: '12px', boxShadow: '0 20px 50px rgba(0,0,0,0.12)', padding: '6px', minWidth: '160px', zIndex: 10, border: `1px solid ${c.border}` }}>
                                        <Link to="/profile" style={dd(c)}>Profile</Link>
                                        <span onClick={handleLogout} style={{...dd(c), color: '#ef4444'}}>Logout</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <div style={{ maxWidth: '1300px', margin: '100px auto 40px', padding: '0 30px' }}>

                {/* HEADER */}
                <div style={{ marginBottom: '35px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: c.primary, letterSpacing: '3px', textTransform: 'uppercase' }}>Shopping Bag</span>
                    <h1 style={{ fontSize: '34px', fontWeight: '800', color: c.text, margin: '8px 0' }}>My Cart</h1>
                    <p style={{ color: c.text2, fontSize: '14px' }}>{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart</p>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '80px' }}>
                        <div style={{ width: '44px', height: '44px', border: '3px solid #e9d5ff', borderTopColor: '#7c3aed', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 20px' }}></div>
                    </div>
                ) : cartItems.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 30px', background: c.card, borderRadius: '24px', border: `1px solid ${c.border}` }}>
                        <div style={{ fontSize: '80px', marginBottom: '20px' }}>🛒</div>
                        <h2 style={{ fontSize: '24px', fontWeight: '700', color: c.text, marginBottom: '10px' }}>Your cart is empty</h2>
                        <p style={{ color: c.text2, fontSize: '15px', marginBottom: '30px' }}>Looks like you haven't added anything yet</p>
                        <Link to="/home" style={{ padding: '16px 36px', background: darkGradient, color: '#fff', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '15px', display: 'inline-block', boxShadow: '0 8px 30px rgba(76,29,149,0.3)' }}>Start Shopping</Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '30px', alignItems: 'start' }}>
                        
                        {/* LEFT - CART ITEMS */}
                        <div>
                            {/* SAVE BANNER */}
                            <div style={{ background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)', borderRadius: '16px', padding: '16px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid #a7f3d0' }}>
                                <span style={{ fontSize: '24px' }}>🎉</span>
                                <div>
                                    <span style={{ fontWeight: '700', color: '#059669', fontSize: '14px' }}>You're saving ₹{discount > 0 ? discount.toLocaleString() : '100'} on this order!</span>
                                    <p style={{ color: '#059669', fontSize: '12px', margin: '2px 0 0' }}>Apply coupon for extra discount</p>
                                </div>
                            </div>

                            {/* CART ITEMS */}
                            <div style={{ background: c.card, borderRadius: '20px', border: `1px solid ${c.border}`, overflow: 'hidden' }}>
                                {cartItems.map((item, idx) => (
                                    <div key={item.id} style={{
                                        display: 'flex', gap: '20px', padding: '24px',
                                        borderBottom: idx < cartItems.length - 1 ? `1px solid ${c.border}` : 'none'
                                    }}>
                                        <Link to={`/product/${item.product?.id}`} style={{ flexShrink: 0 }}>
                                            <div style={{ width: '120px', height: '120px', borderRadius: '14px', overflow: 'hidden', background: c.bg2, border: `1px solid ${c.border}` }}>
                                                <img src={getImage(item.product)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                        </Link>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <div>
                                                    <span style={{ fontSize: '10px', fontWeight: '700', color: c.primary, textTransform: 'uppercase', letterSpacing: '1px' }}>{item.product?.category}</span>
                                                    <h4 style={{ fontSize: '17px', fontWeight: '600', color: c.text, margin: '4px 0' }}>{item.product?.name}</h4>
                                                </div>
                                                <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '20px', padding: '4px 8px' }}>🗑️</button>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '8px 0' }}>
                                                <span style={{ color: '#f59e0b', fontSize: '12px' }}>★★★★★</span>
                                                <span style={{ color: c.text2, fontSize: '12px' }}>4.8</span>
                                                <span style={{ color: '#059669', fontSize: '12px', fontWeight: '600' }}>• In Stock</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', border: `2px solid ${c.border}`, borderRadius: '10px', overflow: 'hidden' }}>
                                                    <button onClick={() => updateQty(item.id, item.quantity - 1)} style={{ width: '34px', height: '34px', border: 'none', background: c.bg2, cursor: 'pointer', fontSize: '16px', color: c.text }}>−</button>
                                                    <span style={{ width: '44px', textAlign: 'center', fontWeight: '700', fontSize: '14px' }}>{item.quantity}</span>
                                                    <button onClick={() => updateQty(item.id, item.quantity + 1)} style={{ width: '34px', height: '34px', border: 'none', background: c.bg2, cursor: 'pointer', fontSize: '16px', color: c.text }}>+</button>
                                                </div>
                                                <span style={{ fontSize: '20px', fontWeight: '700', color: c.text }}>₹{Number(item.product?.price * item.quantity).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* RECOMMENDED */}
                            {recommended.length > 0 && (
                                <div style={{ marginTop: '40px' }}>
                                    <h3 style={{ fontSize: '20px', fontWeight: '700', color: c.text, marginBottom: '20px' }}>You Might Also Like</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
                                        {recommended.map(p => (
                                            <Link to={`/product/${p.id}`} key={p.id} style={{ textDecoration: 'none' }}>
                                                <div style={{ background: c.card, borderRadius: '14px', overflow: 'hidden', border: `1px solid ${c.border}`, transition: 'all 0.3s', cursor: 'pointer' }}
                                                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.06)'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                                                    <div style={{ height: '140px', overflow: 'hidden', background: c.bg2 }}>
                                                        <img src={getImage(p)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    </div>
                                                    <div style={{ padding: '12px' }}>
                                                        <span style={{ fontSize: '10px', fontWeight: '700', color: c.primary, textTransform: 'uppercase' }}>{p.category}</span>
                                                        <h5 style={{ fontSize: '13px', fontWeight: '600', color: c.text, margin: '4px 0' }}>{p.name}</h5>
                                                        <span style={{ fontSize: '15px', fontWeight: '700', color: c.text }}>₹{Number(p.price).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* RIGHT - ORDER SUMMARY */}
                        <div style={{ position: 'sticky', top: '90px' }}>
                            
                            {/* COUPON CARD */}
                            <div style={{ background: c.card, borderRadius: '20px', border: `1px solid ${c.border}`, padding: '24px', marginBottom: '20px' }}>
                                <h4 style={{ fontSize: '15px', fontWeight: '700', color: c.text, marginBottom: '12px' }}>🎫 Have a Coupon?</h4>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <input type="text" placeholder="Enter code" value={promoCode} onChange={e => setPromoCode(e.target.value)}
                                        style={{ flex: 1, padding: '11px 14px', borderRadius: '10px', border: `2px solid ${c.border}`, fontSize: '13px', fontFamily: "'Inter', sans-serif", background: c.input, color: c.text, outline: 'none' }} />
                                    <button onClick={applyPromo} style={{ padding: '11px 18px', background: promoApplied ? '#059669' : darkGradient, color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>
                                        {promoApplied ? '✓' : 'Apply'}
                                    </button>
                                </div>
                                {promoApplied && <p style={{ color: '#059669', fontSize: '12px', fontWeight: '600', marginTop: '8px' }}>✅ 10% discount applied!</p>}
                                <p style={{ color: c.text2, fontSize: '11px', marginTop: '8px' }}>Try: <strong>WELCOME10</strong></p>
                            </div>

                            {/* PRICE SUMMARY */}
                            <div style={{ background: c.card, borderRadius: '20px', border: `1px solid ${c.border}`, padding: '28px' }}>
                                <h4 style={{ fontSize: '17px', fontWeight: '700', color: c.text, marginBottom: '20px', paddingBottom: '15px', borderBottom: `2px solid ${c.border}` }}>Price Details</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: c.text2 }}>Subtotal ({cartItems.length} items)</span><span style={{ color: c.text, fontWeight: '500' }}>₹{subtotal.toLocaleString()}</span></div>
                                    {discount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#059669' }}>Discount (10%)</span><span style={{ color: '#059669', fontWeight: '600' }}>-₹{discount.toLocaleString()}</span></div>}
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: c.text2 }}>Delivery</span><span style={{ color: delivery === 0 ? '#059669' : c.text2, fontWeight: '600' }}>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span></div>
                                    {delivery > 0 && <p style={{ color: '#059669', fontSize: '11px' }}>Add ₹{500 - subtotal} more for free delivery</p>}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '15px', borderTop: `2px solid ${c.text}`, fontSize: '18px', fontWeight: '800', color: c.text }}>
                                        <span>Total</span><span style={{ color: c.primary }}>₹{total.toLocaleString()}</span>
                                    </div>
                                </div>
                                <button onClick={() => navigate('/checkout')} style={{
                                    width: '100%', marginTop: '22px', padding: '16px',
                                    background: darkGradient, color: '#fff', border: 'none',
                                    borderRadius: '12px', fontWeight: '700', fontSize: '16px',
                                    cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                                    boxShadow: '0 8px 30px rgba(76,29,149,0.3)', transition: 'all 0.3s'
                                }}
                                    onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 12px 35px rgba(76,29,149,0.4)'; }}
                                    onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 8px 30px rgba(76,29,149,0.3)'; }}
                                >Proceed to Checkout →</button>
                                
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '15px', fontSize: '12px', color: c.text2 }}>
                                    <span>🔒 Secure</span><span>💳 SSL</span><span>🚚 Fast</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* FOOTER */}
            <footer style={{ background: '#0a0a0a', color: '#e9d5ff', padding: '30px', textAlign: 'center', fontSize: '13px', marginTop: '60px' }}>
                <p style={{ opacity: '0.7' }}>© 2026 e-shop. All rights reserved. Made with 💜</p>
            </footer>
        </div>
    );
}

const dd = (c) => ({ display: 'block', padding: '10px 16px', borderRadius: '10px', color: c.text, textDecoration: 'none', fontSize: '13px', fontWeight: '600' });

export default CartPage;