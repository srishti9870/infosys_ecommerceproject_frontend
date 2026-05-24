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
    const [promoCode, setPromoCode] = useState('');
    const [promoApplied, setPromoApplied] = useState(false);
    const user = getCurrentUser();
    const token = getToken();
    const navigate = useNavigate();
	const theme = useTheme();
	const c = theme.colors;

    useEffect(() => {
        if (user) loadCart();
        window.addEventListener('scroll', () => setScrolled(window.scrollY > 50));
        return () => window.removeEventListener('scroll', () => {});
    }, [user]);

    const loadCart = async () => {
        try {
            const res = await axios.get(`${API_URL}/cart/${user.userId}`, { headers: { Authorization: `Bearer ${token}` } });
            setCartItems(res.data);
        } catch (err) {} finally { setLoading(false); }
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

    const subtotal = cartItems.reduce((s, i) => s + (i.product?.price * i.quantity), 0);
    const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
    const delivery = subtotal > 500 ? 0 : 50;
    const total = subtotal - discount + delivery;

    if (!token) return <Navigate to="/login" />;

    return (
        <div style={{ background: '#faf8ff', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
            {/* NAVBAR */}
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                padding: scrolled ? '8px 0' : '14px 0',
                background: scrolled ? 'rgba(255,255,255,0.97)' : '#fff',
                backdropFilter: scrolled ? 'blur(20px)' : 'none',
                boxShadow: scrolled ? '0 2px 20px rgba(76,29,149,0.08)' : 'none',
                borderBottom: '1px solid #e9d5ff', transition: 'all 0.3s ease',
            }}>
                <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link to="/home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '15px' }}>E</div>
                        <span style={{ fontSize: '20px', fontWeight: '800', color: '#1a0a2e' }}>e-shop</span>
                    </Link>
                    <div style={{ display: 'flex', gap: '25px', fontSize: '13px', fontWeight: '500' }}>
                        <Link to="/home" style={{ color: '#6b7280', textDecoration: 'none' }}>Home</Link>
                        <Link to="/cart" style={{ color: '#4c1d95', textDecoration: 'none', fontWeight: '600' }}>Cart</Link>
                        <Link to="/orders" style={{ color: '#6b7280', textDecoration: 'none' }}>Orders</Link>
                    </div>
                </div>
            </nav>

            <div style={{ maxWidth: '1100px', margin: '100px auto 40px', padding: '0 20px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#1a0a2e', marginBottom: '8px' }}>Shopping Cart</h1>
                <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '35px' }}>{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart</p>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '80px', color: '#6b7280' }}>Loading your cart...</div>
                ) : cartItems.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '100px 30px', background: '#fff', borderRadius: '24px', border: '1px solid #e9d5ff', boxShadow: '0 20px 60px rgba(76,29,149,0.06)' }}>
                        <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#f5f0ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '40px' }}>🛒</div>
                        <h3 style={{ color: '#1a0a2e', fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>Your cart is empty</h3>
                        <p style={{ color: '#6b7280', fontSize: '15px', marginBottom: '30px' }}>Looks like you haven't added anything yet</p>
                        <Link to="/home" style={{ padding: '14px 35px', background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', color: '#fff', borderRadius: '12px', textDecoration: 'none', fontWeight: '600', fontSize: '15px', display: 'inline-block', boxShadow: '0 8px 25px rgba(76,29,149,0.2)' }}>Start Shopping</Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '25px', alignItems: 'start' }}>
                        
                        {/* LEFT - Cart Items */}
                        <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #e9d5ff', overflow: 'hidden', boxShadow: '0 10px 40px rgba(76,29,149,0.05)' }}>
                            {cartItems.map((item, idx) => (
                                <div key={item.id} style={{
                                    display: 'flex', gap: '20px', padding: '25px',
                                    borderBottom: idx < cartItems.length - 1 ? '1px solid #f5f0ff' : 'none',
                                    transition: 'all 0.3s',
                                }}>
                                    {/* Product Image */}
                                    <div style={{ width: '110px', height: '110px', borderRadius: '14px', overflow: 'hidden', background: '#f5f0ff', flexShrink: 0, border: '1px solid #e9d5ff' }}>
                                        <img src={item.product?.imageUrl?.startsWith('/uploads') ? `http://localhost:8080${item.product.imageUrl}` : 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=200&q=80'} 
                                            alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>

                                    {/* Product Info */}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                            <div>
                                                <span style={{ fontSize: '10px', fontWeight: '700', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '1px' }}>{item.product?.category}</span>
                                                <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1a0a2e', margin: '6px 0' }}>{item.product?.name}</h4>
                                            </div>
                                            <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '13px', fontWeight: '600', opacity: '0.7', padding: '4px 8px' }}>Remove</button>
                                        </div>
                                        
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e9d5ff', borderRadius: '8px', overflow: 'hidden' }}>
                                                <button onClick={() => updateQty(item.id, item.quantity - 1)} style={{ width: '32px', height: '32px', border: 'none', background: '#faf8ff', cursor: 'pointer', fontSize: '16px', color: '#4c1d95', fontWeight: '600' }}>−</button>
                                                <span style={{ width: '42px', textAlign: 'center', fontWeight: '700', color: '#1a0a2e', fontSize: '14px' }}>{item.quantity}</span>
                                                <button onClick={() => updateQty(item.id, item.quantity + 1)} style={{ width: '32px', height: '32px', border: 'none', background: '#faf8ff', cursor: 'pointer', fontSize: '16px', color: '#4c1d95', fontWeight: '600' }}>+</button>
                                            </div>
                                            <span style={{ fontSize: '20px', fontWeight: '700', color: '#4c1d95' }}>₹{Number(item.product?.price * item.quantity).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* RIGHT - Order Summary */}
                        <div style={{ position: 'sticky', top: '90px' }}>
                            <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #e9d5ff', padding: '28px', boxShadow: '0 10px 40px rgba(76,29,149,0.05)' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a0a2e', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f5f0ff' }}>Order Summary</h3>
                                
                                {/* Promo Code */}
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                                    <input type="text" placeholder="Promo code" value={promoCode} onChange={e => setPromoCode(e.target.value)}
                                        style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '2px solid #e9d5ff', fontSize: '13px', fontFamily: "'Inter', sans-serif", background: '#faf8ff', outline: 'none' }} />
                                    <button onClick={() => setPromoApplied(true)} style={{ padding: '10px 16px', background: promoApplied ? '#059669' : '#4c1d95', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: "'Inter', sans-serif", whiteSpace: 'nowrap' }}>
                                        {promoApplied ? '✓ Applied' : 'Apply'}
                                    </button>
                                </div>
                                {promoApplied && <p style={{ color: '#059669', fontSize: '12px', fontWeight: '600', marginTop: '-12px', marginBottom: '15px' }}>🎉 10% discount applied!</p>}

                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '14px', color: '#6b7280' }}><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
                                {discount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '14px', color: '#059669' }}><span>Discount</span><span>-₹{discount.toLocaleString()}</span></div>}
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '14px', color: delivery === 0 ? '#059669' : '#6b7280' }}><span>Delivery</span><span>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span></div>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0 0', marginTop: '12px', borderTop: '2px solid #1a0a2e', fontSize: '20px', fontWeight: '800', color: '#1a0a2e' }}>
                                    <span>Total</span><span style={{ color: '#4c1d95' }}>₹{total.toLocaleString()}</span>
                                </div>

                                <button onClick={() => navigate('/checkout')} style={{
                                    width: '100%', marginTop: '22px', padding: '16px',
                                    background: 'linear-gradient(135deg, #4c1d95, #7c3aed)',
                                    color: '#fff', border: 'none', borderRadius: '12px',
                                    fontWeight: '700', fontSize: '16px', cursor: 'pointer',
                                    fontFamily: "'Inter', sans-serif",
                                    boxShadow: '0 8px 30px rgba(76,29,149,0.3)',
                                    transition: 'all 0.3s',
                                }}
                                    onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'}
                                    onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
                                >Proceed to Checkout →</button>
                                
                                <Link to="/home" style={{ display: 'block', textAlign: 'center', marginTop: '15px', color: '#6b7280', textDecoration: 'none', fontSize: '13px', fontWeight: '500' }}>← Continue Shopping</Link>
                            </div>

                            {/* Secure Checkout Badge */}
                            <div style={{ textAlign: 'center', marginTop: '15px', padding: '12px', background: '#fff', borderRadius: '12px', border: '1px solid #e9d5ff', fontSize: '12px', color: '#6b7280' }}>
                                🔒 Secure Checkout • 256-bit SSL
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CartPage;