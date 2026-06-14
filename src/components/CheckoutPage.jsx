import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { getToken, getCurrentUser } from '../services/api';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';

const API_URL = 'http://localhost:8080/api';

function CheckoutPage() {
    const [cartItems, setCartItems] = useState([]);
    const [step, setStep] = useState(1);
    const [recommended, setRecommended] = useState([]);
    const [promoCode, setPromoCode] = useState('');
    const [promoApplied, setPromoApplied] = useState(false);
    
    const user = getCurrentUser();
    const token = getToken();
    const navigate = useNavigate();
    const theme = useTheme();
    const c = theme.colors;
    const darkGradient = 'linear-gradient(160deg, #1a0a2e, #2d1b4e, #4c1d95)';

    const [address, setAddress] = useState({ fullName: '', mobile: '', pincode: '', city: '', state: '', address: '' });
    const [payment, setPayment] = useState({ method: 'COD' });

    useEffect(() => {
        if (user) { loadCart(); loadRecommended(); }
    }, [user]);

    const loadCart = async () => {
        try {
            const res = await axios.get(`${API_URL}/cart/${user.userId}`, { headers: { Authorization: `Bearer ${token}` } });
            setCartItems(res.data || []);
        } catch (err) {}
    };

    const loadRecommended = async () => {
        try {
            const res = await axios.get(`${API_URL}/products?page=0&size=4`);
            const data = res.data.products || res.data || [];
            setRecommended(Array.isArray(data) ? data.slice(0, 4) : []);
        } catch (err) {}
    };

    const handlePlaceOrder = async () => {
        const fullAddress = `${address.fullName}, ${address.address}, ${address.city}, ${address.state} - ${address.pincode}, ${address.mobile}`;
        try {
            const res = await axios.post(`${API_URL}/orders/checkout/${user.userId}`, {
                shippingAddress: fullAddress, paymentMethod: payment.method
            }, { headers: { Authorization: `Bearer ${token}` } });
            navigate(`/order-success?id=${res.data.orderId}`);
        } catch (err) { alert('Failed to place order'); }
    };

    const applyPromo = () => {
        if (promoCode.toUpperCase() === 'WELCOME10') setPromoApplied(true);
        else alert('Invalid promo code');
    };

    const subtotal = cartItems.reduce((s, i) => s + (i.product?.price * i.quantity), 0);
    const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
    const tax = Math.round((subtotal - discount) * 0.18);
    const delivery = subtotal > 500 ? 0 : 50;
    const total = subtotal - discount + tax + delivery;

    if (!token) return <Navigate to="/login" />;

    const inputStyle = {
        width: '100%', padding: '14px 18px', borderRadius: '12px', border: `2px solid ${c.border}`,
        outline: 'none', fontSize: '14px', fontFamily: "'Inter', sans-serif", background: c.input,
        color: c.text, boxSizing: 'border-box', transition: 'all 0.3s'
    };
    const labelStyle = { fontSize: '12px', fontWeight: '600', color: c.text, marginBottom: '6px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' };

    return (
        <div style={{ background: c.bg, minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: c.text }}>

            {/* SIMPLE HEADER */}
            <div style={{ background: c.card, borderBottom: `1px solid ${c.border}`, padding: '20px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: darkGradient, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '18px' }}>E</div>
                    <span style={{ fontSize: '22px', fontWeight: '800', color: c.text }}>e-shop</span>
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <span style={{ fontSize: '13px', color: '#059669', fontWeight: '600' }}>🔒 Secure Checkout</span>
                    <Link to="/cart" style={{ color: c.text2, textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>← Cart</Link>
                </div>
            </div>

            <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 30px' }}>

                {cartItems.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '100px 30px', background: c.card, borderRadius: '24px', border: `1px solid ${c.border}` }}>
                        <div style={{ fontSize: '60px', marginBottom: '20px' }}>🛒</div>
                        <h2 style={{ fontSize: '24px', fontWeight: '700', color: c.text }}>Your cart is empty</h2>
                        <Link to="/home" style={{ padding: '14px 32px', background: darkGradient, color: '#fff', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '15px', display: 'inline-block', marginTop: '20px' }}>Continue Shopping</Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '30px', alignItems: 'start' }}>
                        
                        {/* LEFT */}
                        <div>
                            {/* PROGRESS BAR */}
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '35px', background: c.card, borderRadius: '16px', padding: '20px', border: `1px solid ${c.border}` }}>
                                {['Address', 'Payment', 'Confirm'].map((s, i) => (
                                    <React.Fragment key={s}>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{
                                                width: '40px', height: '40px', borderRadius: '50%',
                                                background: step >= i+1 ? darkGradient : c.border,
                                                color: step >= i+1 ? '#fff' : c.text2,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontWeight: '700', fontSize: '15px', transition: 'all 0.5s'
                                            }}>{step > i+1 ? '✓' : i+1}</div>
                                            <p style={{ fontSize: '11px', fontWeight: step >= i+1 ? '700' : '500', color: step >= i+1 ? c.primary : c.text2, marginTop: '6px' }}>{s}</p>
                                        </div>
                                        {i < 2 && <div style={{ flex: 1, height: '3px', borderRadius: '2px', background: step > i+1 ? '#7c3aed' : c.border, marginBottom: '20px' }}></div>}
                                    </React.Fragment>
                                ))}
                            </div>

                            {/* STEP 1 */}
                            {step === 1 && (
                                <div style={{ background: c.card, borderRadius: '20px', border: `1px solid ${c.border}`, padding: '35px' }}>
                                    <h3 style={{ fontSize: '20px', fontWeight: '700', color: c.text, marginBottom: '20px' }}>📍 Delivery Address</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        {[['Full Name', 'fullName', 'text'], ['Mobile', 'mobile', 'tel'], ['Pincode', 'pincode', 'text'], ['City', 'city', 'text'], ['State', 'state', 'text']].map(f => (
                                            <div key={f[1]}>
                                                <label style={labelStyle}>{f[0]} *</label>
                                                <input type={f[2]} value={address[f[1]]} onChange={e => setAddress({...address, [f[1]]: e.target.value})} style={inputStyle} />
                                            </div>
                                        ))}
                                        <div style={{ gridColumn: '1/-1' }}>
                                            <label style={labelStyle}>Address *</label>
                                            <textarea value={address.address} onChange={e => setAddress({...address, address: e.target.value})} style={{...inputStyle, height: '70px', resize: 'vertical'}} />
                                        </div>
                                    </div>
                                    <button onClick={() => setStep(2)} style={{ width: '100%', marginTop: '25px', padding: '16px', background: darkGradient, color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '16px', cursor: 'pointer', fontFamily: "'Inter', sans-serif", boxShadow: '0 8px 30px rgba(76,29,149,0.3)' }}>
                                        Continue to Payment →
                                    </button>
                                </div>
                            )}

                            {/* STEP 2 */}
                            {step === 2 && (
                                <div style={{ background: c.card, borderRadius: '20px', border: `1px solid ${c.border}`, padding: '35px' }}>
                                    <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: c.primary, cursor: 'pointer', fontWeight: '600', fontSize: '14px', marginBottom: '20px' }}>← Back</button>
                                    <h3 style={{ fontSize: '20px', fontWeight: '700', color: c.text, marginBottom: '20px' }}>💳 Payment Method</h3>
                                    {[{ id: 'COD', label: 'Cash on Delivery', desc: 'Pay when you receive', icon: '💵' }, { id: 'UPI', label: 'UPI Payment', desc: 'Google Pay, PhonePe', icon: '📱' }, { id: 'CARD', label: 'Credit/Debit Card', desc: 'Visa, Mastercard', icon: '💳' }].map(p => (
                                        <div key={p.id} onClick={() => setPayment({method: p.id})} style={{
                                            padding: '18px 22px', marginBottom: '10px', borderRadius: '14px',
                                            border: payment.method === p.id ? `2px solid #7c3aed` : `1px solid ${c.border}`,
                                            cursor: 'pointer', background: payment.method === p.id ? c.hover : c.card,
                                            transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '15px'
                                        }}>
                                            <span style={{ fontSize: '28px' }}>{p.icon}</span>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontWeight: '700', color: payment.method === p.id ? c.primary : c.text, fontSize: '15px', margin: '0 0 3px' }}>{p.label}</p>
                                                <p style={{ color: c.text2, fontSize: '12px', margin: 0 }}>{p.desc}</p>
                                            </div>
                                            {payment.method === p.id && <span style={{ color: '#7c3aed', fontWeight: '700', fontSize: '22px' }}>✓</span>}
                                        </div>
                                    ))}
                                    <div style={{ display: 'flex', gap: '12px', marginTop: '25px' }}>
                                        <button onClick={() => setStep(1)} style={{ flex: 1, padding: '15px', background: c.bg2, color: c.text, border: `1px solid ${c.border}`, borderRadius: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>Back</button>
                                        <button onClick={() => setStep(3)} style={{ flex: 1, padding: '15px', background: darkGradient, color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>Review Order →</button>
                                    </div>
                                </div>
                            )}

                            {/* STEP 3 */}
                            {step === 3 && (
                                <div style={{ background: c.card, borderRadius: '20px', border: `1px solid ${c.border}`, padding: '35px' }}>
                                    <button onClick={() => setStep(2)} style={{ background: 'none', border: 'none', color: c.primary, cursor: 'pointer', fontWeight: '600', fontSize: '14px', marginBottom: '20px' }}>← Back</button>
                                    <h3 style={{ fontSize: '20px', fontWeight: '700', color: c.text, marginBottom: '20px' }}>📋 Confirm Order</h3>
                                    
                                    <div style={{ background: c.bg2, padding: '18px', borderRadius: '14px', marginBottom: '20px' }}>
                                        <p style={{ fontWeight: '600', color: c.primary, fontSize: '14px', marginBottom: '6px' }}>📍 {address.fullName} | {address.mobile}</p>
                                        <p style={{ color: c.text2, fontSize: '13px' }}>{address.address}, {address.city}, {address.state} - {address.pincode}</p>
                                        <p style={{ fontWeight: '600', color: c.primary, fontSize: '13px', marginTop: '10px' }}>💳 {payment.method}</p>
                                    </div>

                                    {cartItems.map(item => (
                                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${c.border}` }}>
                                            <span style={{ fontSize: '14px', color: c.text }}>{item.product?.name} × {item.quantity}</span>
                                            <span style={{ fontWeight: '600', color: c.text }}>₹{(item.product?.price * item.quantity).toLocaleString()}</span>
                                        </div>
                                    ))}

                                    <div style={{ display: 'flex', gap: '12px', marginTop: '25px' }}>
                                        <button onClick={() => setStep(2)} style={{ flex: 1, padding: '15px', background: c.bg2, color: c.text, border: `1px solid ${c.border}`, borderRadius: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>Back</button>
                                        <button onClick={handlePlaceOrder} style={{ flex: 1, padding: '15px', background: darkGradient, color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '16px', cursor: 'pointer', fontFamily: "'Inter', sans-serif", boxShadow: '0 8px 30px rgba(76,29,149,0.3)' }}>🎉 Place Order</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* RIGHT - SUMMARY + EXTRAS */}
                        <div style={{ position: 'sticky', top: '20px' }}>
                            
                            {/* TRUST CARDS */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                                {[
                                    { icon: '🚚', title: 'Free Delivery', desc: 'Above ₹500' },
                                    { icon: '↩️', title: 'Easy Returns', desc: '30 days' },
                                    { icon: '🔒', title: 'Secure', desc: 'SSL Encrypted' },
                                    { icon: '⭐', title: 'Quality', desc: 'Guaranteed' },
                                ].map(card => (
                                    <div key={card.title} style={{ background: c.card, borderRadius: '14px', border: `1px solid ${c.border}`, padding: '16px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '24px', marginBottom: '6px' }}>{card.icon}</div>
                                        <p style={{ fontSize: '12px', fontWeight: '700', color: c.text, marginBottom: '2px' }}>{card.title}</p>
                                        <p style={{ fontSize: '10px', color: c.text2 }}>{card.desc}</p>
                                    </div>
                                ))}
                            </div>

                            {/* COUPON */}
                            <div style={{ background: c.card, borderRadius: '20px', border: `1px solid ${c.border}`, padding: '20px', marginBottom: '20px' }}>
                                <h4 style={{ fontSize: '15px', fontWeight: '700', color: c.text, marginBottom: '10px' }}>🎫 Coupon Code</h4>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <input type="text" placeholder="WELCOME10" value={promoCode} onChange={e => setPromoCode(e.target.value)}
                                        style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', border: `2px solid ${c.border}`, fontSize: '13px', fontFamily: "'Inter', sans-serif", background: c.input, color: c.text, outline: 'none' }} />
                                    <button onClick={applyPromo} style={{ padding: '10px 16px', background: promoApplied ? '#059669' : darkGradient, color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>
                                        {promoApplied ? '✓' : 'Apply'}
                                    </button>
                                </div>
                                {promoApplied && <p style={{ color: '#059669', fontSize: '12px', fontWeight: '600', marginTop: '8px' }}>✅ 10% off applied!</p>}
                            </div>

                            {/* PRICE SUMMARY */}
                            <div style={{ background: c.card, borderRadius: '20px', border: `1px solid ${c.border}`, padding: '24px' }}>
                                <h4 style={{ fontSize: '16px', fontWeight: '700', color: c.text, marginBottom: '15px', paddingBottom: '12px', borderBottom: `2px solid ${c.border}` }}>Price Details</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: c.text2 }}>Subtotal</span><span style={{ color: c.text }}>₹{subtotal.toLocaleString()}</span></div>
                                    {discount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#059669' }}>Discount</span><span style={{ color: '#059669' }}>-₹{discount.toLocaleString()}</span></div>}
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: c.text2 }}>GST (18%)</span><span style={{ color: c.text }}>₹{tax.toLocaleString()}</span></div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: c.text2 }}>Delivery</span><span style={{ color: delivery === 0 ? '#059669' : c.text2, fontWeight: '600' }}>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span></div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: `2px solid ${c.text}`, fontSize: '18px', fontWeight: '800', color: c.text }}>
                                        <span>Total</span><span style={{ color: c.primary }}>₹{total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* RECOMMENDED */}
                            {recommended.length > 0 && (
                                <div style={{ marginTop: '20px', background: c.card, borderRadius: '20px', border: `1px solid ${c.border}`, padding: '20px' }}>
                                    <h4 style={{ fontSize: '14px', fontWeight: '700', color: c.text, marginBottom: '12px' }}>🎯 You Might Like</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                        {recommended.slice(0, 4).map(p => (
                                            <Link to={`/product/${p.id}`} key={p.id} style={{ textDecoration: 'none' }}>
                                                <div style={{ borderRadius: '12px', overflow: 'hidden', border: `1px solid ${c.border}`, transition: 'all 0.3s', cursor: 'pointer' }}
                                                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                                                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                                    <div style={{ height: '80px', overflow: 'hidden', background: c.bg2 }}>
                                                        <img src={`/images/${(p.category || 'default').toLowerCase()}.jpg`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    </div>
                                                    <div style={{ padding: '8px 10px' }}>
                                                        <p style={{ fontSize: '11px', fontWeight: '600', color: c.text, margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</p>
                                                        <span style={{ fontSize: '12px', fontWeight: '700', color: c.primary }}>₹{Number(p.price).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <footer style={{ background: '#0a0a0a', color: '#e9d5ff', padding: '30px', textAlign: 'center', fontSize: '13px', marginTop: '60px' }}>
                <p style={{ opacity: '0.7' }}>© 2026 e-shop. All rights reserved. Made with 💜</p>
            </footer>
        </div>
    );
}

export default CheckoutPage;