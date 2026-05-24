import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { getToken, getCurrentUser } from '../services/api';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
const API_URL = 'http://localhost:8080/api';

function CheckoutPage() {
    const [cartItems, setCartItems] = useState([]);
    const [step, setStep] = useState(1);
    const [scrolled, setScrolled] = useState(false);
    const user = getCurrentUser();
    const token = getToken();
    const navigate = useNavigate();
	const theme = useTheme();
	const c = theme.colors;

    const [address, setAddress] = useState({ fullName: '', mobile: '', pincode: '', city: '', state: '', address: '' });
    const [payment, setPayment] = useState({ method: 'COD' });
    const [savedAddresses] = useState([
        { id: 1, label: '🏠 Home', full: 'Flat 302, Sunshine Apartments, Andheri West, Mumbai - 400053', name: 'Srishti Mamgai', mobile: '9876543210' },
    ]);

    useEffect(() => {
        if (user) loadCart();
        window.addEventListener('scroll', () => setScrolled(window.scrollY > 50));
        return () => window.removeEventListener('scroll', () => {});
    }, [user]);

    const loadCart = async () => {
        try {
            const res = await axios.get(`${API_URL}/cart/${user.userId}`, { headers: { Authorization: `Bearer ${token}` } });
            setCartItems(res.data);
        } catch (err) {}
    };

    const handlePlaceOrder = async () => {
        const fullAddress = `${address.fullName}, ${address.address}, ${address.city}, ${address.state} - ${address.pincode}, ${address.mobile}`;
        try {
            const res = await axios.post(`${API_URL}/orders/checkout/${user.userId}`, { shippingAddress: fullAddress, paymentMethod: payment.method }, { headers: { Authorization: `Bearer ${token}` } });
            navigate(`/order-success?id=${res.data.orderId}`);
        } catch (err) { alert('Failed to place order'); }
    };

    const subtotal = cartItems.reduce((s, i) => s + (i.product?.price * i.quantity), 0);
    const tax = Math.round(subtotal * 0.18);
    const delivery = subtotal > 500 ? 0 : 50;
    const total = subtotal + tax + delivery;

    if (!token) return <Navigate to="/login" />;

    const inputStyle = {
        width: '100%', padding: '13px 16px', borderRadius: '10px', border: '2px solid #e9d5ff',
        outline: 'none', fontSize: '14px', fontFamily: "'Inter', sans-serif", background: '#faf8ff',
        color: '#1a0a2e', boxSizing: 'border-box', marginTop: '6px', transition: 'all 0.3s'
    };
    const labelStyle = { fontSize: '12px', fontWeight: '600', color: '#4c1d95', textTransform: 'uppercase', letterSpacing: '0.5px' };

    const stepCircle = (s) => ({
        width: '42px', height: '42px', borderRadius: '50%',
        background: step >= s ? 'linear-gradient(135deg, #4c1d95, #7c3aed)' : '#e9d5ff',
        color: step >= s ? '#fff' : '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: '700', fontSize: '15px', fontFamily: "'Inter', sans-serif",
        boxShadow: step >= s ? '0 6px 20px rgba(76,29,149,0.2)' : 'none', transition: 'all 0.4s'
    });

    return (
        <div style={{ background: '#faf8ff', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
            {/* NAVBAR */}
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                padding: scrolled ? '8px 0' : '14px 0',
                background: scrolled ? 'rgba(255,255,255,0.97)' : '#fff',
                backdropFilter: scrolled ? 'blur(20px)' : 'none',
                borderBottom: '1px solid #e9d5ff', transition: 'all 0.3s ease',
            }}>
                <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link to="/home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '15px' }}>E</div>
                        <span style={{ fontSize: '20px', fontWeight: '800', color: '#1a0a2e' }}>e-shop</span>
                    </Link>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#4c1d95' }}>Secure Checkout 🔒</span>
                </div>
            </nav>

            <div style={{ maxWidth: '1100px', margin: '100px auto 40px', padding: '0 20px' }}>
                {cartItems.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '100px', background: '#fff', borderRadius: '24px', border: '1px solid #e9d5ff' }}>
                        <h3 style={{ color: '#1a0a2e', fontSize: '22px' }}>Your cart is empty</h3>
                        <Link to="/home" style={{ color: '#4c1d95', fontWeight: '600', marginTop: '15px', display: 'inline-block' }}>Continue Shopping</Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '25px', alignItems: 'start' }}>
                        
                        {/* LEFT - Checkout Form */}
                        <div>
                            {/* Step Indicators */}
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '30px' }}>
                                {['Address', 'Payment', 'Review'].map((s, i) => (
                                    <React.Fragment key={s}>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={stepCircle(i+1)}>{step > i+1 ? '✓' : i+1}</div>
                                            <p style={{ fontSize: '11px', fontWeight: step >= i+1 ? '700' : '500', color: step >= i+1 ? '#4c1d95' : '#6b7280', marginTop: '8px' }}>{s}</p>
                                        </div>
                                        {i < 2 && <div style={{ width: '70px', height: '2px', background: step > i+1 ? '#7c3aed' : '#e9d5ff', marginBottom: '22px', transition: 'all 0.4s' }}></div>}
                                    </React.Fragment>
                                ))}
                            </div>

                            {/* STEP 1: ADDRESS */}
                            {step === 1 && (
                                <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #e9d5ff', padding: '35px', boxShadow: '0 10px 40px rgba(76,29,149,0.06)' }}>
                                    <h3 style={{ color: '#1a0a2e', fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>📍 Delivery Address</h3>
                                    <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '25px' }}>Where should we deliver your order?</p>
                                    
                                    {/* Saved Addresses */}
                                    <div style={{ marginBottom: '25px' }}>
                                        {savedAddresses.map(addr => (
                                            <div key={addr.id} style={{ padding: '16px 20px', background: '#faf8ff', borderRadius: '12px', marginBottom: '10px', border: '1px solid #e9d5ff', cursor: 'pointer', transition: 'all 0.3s' }}
                                                onClick={() => setAddress({ fullName: addr.name, mobile: addr.mobile, address: addr.full, city: 'Mumbai', state: 'Maharashtra', pincode: '400053' })}>
                                                <p style={{ fontWeight: '600', color: '#1a0a2e', fontSize: '14px', marginBottom: '4px' }}>{addr.label}</p>
                                                <p style={{ color: '#6b7280', fontSize: '13px' }}>{addr.full}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <p style={{ fontWeight: '600', color: '#4c1d95', fontSize: '13px', marginBottom: '18px' }}>Or enter new address</p>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        {[
                                            ['Full Name', 'fullName', 'text'],
                                            ['Mobile Number', 'mobile', 'tel'],
                                            ['Pincode', 'pincode', 'text'],
                                            ['City', 'city', 'text'],
                                            ['State', 'state', 'text'],
                                        ].map(f => (
                                            <div key={f[1]}>
                                                <label style={labelStyle}>{f[0]} *</label>
                                                <input type={f[2]} required value={address[f[1]]} onChange={e => setAddress({...address, [f[1]]: e.target.value})} style={inputStyle} />
                                            </div>
                                        ))}
                                        <div style={{ gridColumn: '1/-1' }}>
                                            <label style={labelStyle}>Full Address *</label>
                                            <textarea required value={address.address} onChange={e => setAddress({...address, address: e.target.value})} style={{...inputStyle, height: '70px', resize: 'vertical'}} />
                                        </div>
                                    </div>
                                    <button onClick={() => setStep(2)} style={{ width: '100%', marginTop: '22px', padding: '15px', background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: "'Inter', sans-serif", boxShadow: '0 8px 25px rgba(76,29,149,0.2)' }}>Continue to Payment →</button>
                                </div>
                            )}

                            {/* STEP 2: PAYMENT */}
                            {step === 2 && (
                                <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #e9d5ff', padding: '35px', boxShadow: '0 10px 40px rgba(76,29,149,0.06)' }}>
                                    <h3 style={{ color: '#1a0a2e', fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>💳 Payment Method</h3>
                                    <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '25px' }}>Choose how you'd like to pay</p>
                                    {[
                                        { id: 'COD', label: 'Cash on Delivery', desc: 'Pay when your order arrives', icon: '💵' },
                                        { id: 'UPI', label: 'UPI', desc: 'Google Pay, PhonePe, Paytm', icon: '📱' },
                                        { id: 'CARD', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay', icon: '💳' },
                                        { id: 'NB', label: 'Net Banking', desc: 'All major banks supported', icon: '🏦' },
                                    ].map(p => (
                                        <div key={p.id} onClick={() => setPayment({method: p.id})} style={{
                                            padding: '18px 22px', marginBottom: '10px', borderRadius: '12px',
                                            border: payment.method === p.id ? '2px solid #7c3aed' : '1px solid #e9d5ff',
                                            cursor: 'pointer', background: payment.method === p.id ? '#f5f0ff' : '#fff',
                                            transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '15px'
                                        }}>
                                            <span style={{ fontSize: '28px' }}>{p.icon}</span>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontWeight: '700', color: payment.method === p.id ? '#4c1d95' : '#1a0a2e', fontSize: '14px', margin: '0 0 3px' }}>{p.label}</p>
                                                <p style={{ color: '#6b7280', fontSize: '12px', margin: 0 }}>{p.desc}</p>
                                            </div>
                                            {payment.method === p.id && <span style={{ color: '#7c3aed', fontWeight: '700', fontSize: '22px' }}>✓</span>}
                                        </div>
                                    ))}
                                    <div style={{ display: 'flex', gap: '12px', marginTop: '25px' }}>
                                        <button onClick={() => setStep(1)} style={{ flex: 1, padding: '14px', background: '#f3e8ff', color: '#4c1d95', border: 'none', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>← Back</button>
                                        <button onClick={() => setStep(3)} style={{ flex: 1, padding: '14px', background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>Review Order →</button>
                                    </div>
                                </div>
                            )}

                            {/* STEP 3: REVIEW */}
                            {step === 3 && (
                                <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #e9d5ff', padding: '35px', boxShadow: '0 10px 40px rgba(76,29,149,0.06)' }}>
                                    <h3 style={{ color: '#1a0a2e', fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>📋 Review Your Order</h3>
                                    
                                    <div style={{ background: '#faf8ff', padding: '18px', borderRadius: '12px', marginBottom: '20px' }}>
                                        <p style={{ fontWeight: '600', color: '#4c1d95', fontSize: '14px', marginBottom: '6px' }}>📍 Delivery Address</p>
                                        <p style={{ color: '#1a0a2e', fontSize: '14px', fontWeight: '500' }}>{address.fullName} | {address.mobile}</p>
                                        <p style={{ color: '#6b7280', fontSize: '13px' }}>{address.address}, {address.city}, {address.state} - {address.pincode}</p>
                                        <p style={{ fontWeight: '600', color: '#4c1d95', fontSize: '13px', marginTop: '12px' }}>💳 {payment.method === 'COD' ? 'Cash on Delivery' : payment.method === 'UPI' ? 'UPI Payment' : payment.method === 'CARD' ? 'Card Payment' : 'Net Banking'}</p>
                                    </div>

                                    <p style={{ fontWeight: '600', color: '#1a0a2e', fontSize: '14px', marginBottom: '12px' }}>Items ({cartItems.length})</p>
                                    {cartItems.map(item => (
                                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f5f0ff' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: '45px', height: '45px', borderRadius: '8px', overflow: 'hidden', background: '#f5f0ff' }}>
                                                    <img src={item.product?.imageUrl?.startsWith('/uploads') ? `http://localhost:8080${item.product.imageUrl}` : 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=100&q=80'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>
                                                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1a0a2e' }}>{item.product?.name} <span style={{ color: '#6b7280' }}>× {item.quantity}</span></span>
                                            </div>
                                            <span style={{ fontWeight: '600', color: '#4c1d95', fontSize: '14px' }}>₹{(item.product?.price * item.quantity).toLocaleString()}</span>
                                        </div>
                                    ))}

                                    <div style={{ display: 'flex', gap: '12px', marginTop: '25px' }}>
                                        <button onClick={() => setStep(2)} style={{ flex: 1, padding: '14px', background: '#f3e8ff', color: '#4c1d95', border: 'none', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>← Back</button>
                                        <button onClick={handlePlaceOrder} style={{ flex: 1, padding: '14px', background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '16px', cursor: 'pointer', fontFamily: "'Inter', sans-serif", boxShadow: '0 8px 25px rgba(76,29,149,0.25)' }}>🎉 Place Order</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* RIGHT - Order Summary Sidebar */}
                        <div style={{ position: 'sticky', top: '90px' }}>
                            <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #e9d5ff', padding: '28px', boxShadow: '0 10px 40px rgba(76,29,149,0.05)' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a0a2e', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f5f0ff' }}>Price Details</h3>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '14px', color: '#6b7280' }}><span>Subtotal ({cartItems.length} items)</span><span>₹{subtotal.toLocaleString()}</span></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '14px', color: '#6b7280' }}><span>GST (18%)</span><span>₹{tax.toLocaleString()}</span></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '14px', color: delivery === 0 ? '#059669' : '#6b7280' }}><span>Delivery</span><span style={{ fontWeight: '600' }}>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span></div>
                                {delivery === 0 && <p style={{ color: '#059669', fontSize: '11px', fontWeight: '600', marginTop: '-2px' }}>You saved ₹50 on delivery!</p>}
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0 0', marginTop: '12px', borderTop: '2px solid #1a0a2e', fontSize: '20px', fontWeight: '800', color: '#1a0a2e' }}>
                                    <span>Total</span><span style={{ color: '#4c1d95' }}>₹{total.toLocaleString()}</span>
                                </div>
                            </div>
                            <div style={{ textAlign: 'center', marginTop: '12px', padding: '12px', background: '#fff', borderRadius: '12px', border: '1px solid #e9d5ff', fontSize: '12px', color: '#6b7280' }}>
                                🔒 Secure SSL Encrypted Checkout
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CheckoutPage;