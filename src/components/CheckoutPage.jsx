import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { getToken, getCurrentUser } from '../services/api';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

function CheckoutPage() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState(1);
    const user = getCurrentUser();
    const token = getToken();
    const navigate = useNavigate();

    const [address, setAddress] = useState({
        fullName: '', mobile: '', pincode: '', city: '', state: '', address: ''
    });

    const [payment, setPayment] = useState({ method: 'COD' });

    useEffect(() => {
        if (user) loadCart();
    }, [user]);

    const loadCart = async () => {
        try {
            const response = await axios.get(`${API_URL}/cart/${user.userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCartItems(response.data);
        } catch (err) {
            console.error('Failed to load cart');
        } finally {
            setLoading(false);
        }
    };

	const handlePlaceOrder = async () => {
	    const fullAddress = `${address.fullName}, ${address.address}, ${address.city}, ${address.state} - ${address.pincode}, Mobile: ${address.mobile}`;
	    try {
	        const response = await axios.post(`${API_URL}/orders/checkout/${user.userId}`, {
	            shippingAddress: fullAddress,
	            paymentMethod: payment.method
	        }, {
	            headers: { Authorization: `Bearer ${token}` }
	        });
	        navigate(`/order-success?id=${response.data.orderId}`);
	    } catch (err) {
	        const errorMsg = err.response?.data?.error || 'Failed to place order. Please try again.';
	        alert(errorMsg);
	    }
	};
    const total = cartItems.reduce((sum, item) => sum + (item.product?.price * item.quantity), 0);
    const tax = Math.round(total * 0.18);
    const delivery = total > 500 ? 0 : 50;
    const grandTotal = total + tax + delivery;

    if (!token) return <Navigate to="/login" />;
    if (loading) return <div style={{ textAlign: 'center', padding: '50px', fontFamily: "'Inter', sans-serif" }}>Loading...</div>;

    if (cartItems.length === 0) {
        return (
            <div style={{ background: '#f1f2f4', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
                <div style={{ background: '#2874f0', padding: '15px 30px', color: 'white' }}>
                    <Link to="/home" style={{ color: 'white', textDecoration: 'none', fontSize: '20px', fontWeight: '800' }}>e-shop</Link>
                </div>
                <div style={{ textAlign: 'center', padding: '80px' }}>
                    <span style={{ fontSize: '60px' }}>🛒</span>
                    <h3>Your cart is empty</h3>
                    <Link to="/home" style={{ color: '#2874f0', fontWeight: '600', textDecoration: 'none' }}>Shop Now</Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: '#f1f2f4', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
            <div style={{ background: '#2874f0', padding: '15px 30px', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
                <Link to="/home" style={{ color: 'white', textDecoration: 'none', fontSize: '20px', fontWeight: '800' }}>e-shop</Link>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>Checkout</span>
            </div>

            {/* Steps */}
            <div style={{ maxWidth: '500px', margin: '15px auto', display: 'flex', justifyContent: 'center' }}>
                {['ADDRESS', 'PAYMENT', 'REVIEW'].map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{
                            width: '32px', height: '32px', borderRadius: '50%',
                            background: step >= i+1 ? '#2874f0' : '#e0e0e0', color: 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '13px', fontWeight: '700'
                        }}>{step > i+1 ? '✓' : i+1}</div>
                        <span style={{ marginLeft: '6px', fontSize: '11px', fontWeight: step >= i+1 ? '700' : '500', color: step >= i+1 ? '#2874f0' : '#878787' }}>{s}</span>
                        {i < 2 && <div style={{ width: '50px', height: '2px', background: step > i+1 ? '#2874f0' : '#e0e0e0', margin: '0 8px' }}></div>}
                    </div>
                ))}
            </div>

            <div style={{ maxWidth: '750px', margin: '20px auto', padding: '0 20px' }}>
                
                {step === 1 && (
                    <div style={{ background: 'white', borderRadius: '4px', padding: '25px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#212121', marginBottom: '20px' }}>📍 Delivery Address</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            {[
                                ['Full Name *', 'fullName', 'text'],
                                ['Mobile *', 'mobile', 'tel'],
                                ['Pincode *', 'pincode', 'text'],
                                ['City *', 'city', 'text'],
                                ['State *', 'state', 'text'],
                            ].map(f => (
                                <div key={f[1]}>
                                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#555' }}>{f[0]}</label>
                                    <input type={f[2]} required value={address[f[1]]} onChange={e => setAddress({...address, [f[1]]: e.target.value})}
                                        style={{ width: '100%', padding: '10px', fontSize: '13px', borderRadius: '2px', border: '1px solid #e0e0e0', outline: 'none', boxSizing: 'border-box', marginTop: '4px', fontFamily: "'Inter', sans-serif" }} />
                                </div>
                            ))}
                            <div style={{ gridColumn: '1/-1' }}>
                                <label style={{ fontSize: '12px', fontWeight: '600', color: '#555' }}>Full Address *</label>
                                <textarea required value={address.address} onChange={e => setAddress({...address, address: e.target.value})}
                                    style={{ width: '100%', padding: '10px', fontSize: '13px', borderRadius: '2px', border: '1px solid #e0e0e0', outline: 'none', boxSizing: 'border-box', marginTop: '4px', height: '60px', resize: 'vertical', fontFamily: "'Inter', sans-serif" }} />
                            </div>
                        </div>
						<button onClick={() => {
						    if (!address.fullName || !address.mobile || !address.pincode || !address.city || !address.address) {
						        alert('Please fill all required fields');
						        return;
						    }
						    if (address.mobile.length !== 10) {
						        alert('Enter valid 10-digit mobile number');
						        return;
						    }
						    if (address.pincode.length !== 6) {
						        alert('Enter valid 6-digit pincode');
						        return;
						    }
						    setStep(2);
						}} style={{ width: '100%', marginTop: '20px', padding: '14px', background: '#2874f0', color: 'white', border: 'none', borderRadius: '2px', fontWeight: '700', fontSize: '16px', cursor: 'pointer', fontFamily: "'Inter', sans-serif'" }}>
						    Continue to Payment →
						</button>
                    </div>
                )}

                {step === 2 && (
                    <div style={{ background: 'white', borderRadius: '4px', padding: '25px' }}>
                        <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#2874f0', cursor: 'pointer', fontWeight: '600', fontSize: '13px', marginBottom: '20px' }}>← Back</button>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#212121', marginBottom: '20px' }}>💳 Payment Method</h3>
                        {[
                            { id: 'COD', label: 'Cash on Delivery', icon: '💵' },
                            { id: 'UPI', label: 'UPI (Google Pay, PhonePe)', icon: '📱' },
                            { id: 'CARD', label: 'Credit/Debit Card', icon: '💳' },
                        ].map(p => (
                            <div key={p.id} onClick={() => setPayment({method: p.id})}
                                style={{ padding: '15px', marginBottom: '10px', border: payment.method === p.id ? '2px solid #2874f0' : '1px solid #e0e0e0', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', background: payment.method === p.id ? '#E3F0FF' : 'white' }}>
                                <span style={{ fontSize: '24px' }}>{p.icon}</span>
                                <span style={{ fontWeight: '600', color: '#212121', fontSize: '14px' }}>{p.label}</span>
                                {payment.method === p.id && <span style={{ marginLeft: 'auto', color: '#2874f0', fontWeight: '700', fontSize: '18px' }}>✓</span>}
                            </div>
                        ))}
                        <button onClick={() => setStep(3)} style={{ width: '100%', marginTop: '20px', padding: '14px', background: '#2874f0', color: 'white', border: 'none', borderRadius: '2px', fontWeight: '700', fontSize: '16px', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>
                            Review Order →
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div style={{ background: 'white', borderRadius: '4px', padding: '25px' }}>
                        <button onClick={() => setStep(2)} style={{ background: 'none', border: 'none', color: '#2874f0', cursor: 'pointer', fontWeight: '600', fontSize: '13px', marginBottom: '20px' }}>← Back</button>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#212121', marginBottom: '20px' }}>📋 Review Order</h3>
                        
                        <div style={{ padding: '12px', background: '#fafafa', borderRadius: '4px', marginBottom: '15px', fontSize: '13px' }}>
                            <p style={{ fontWeight: '700', margin: '0 0 5px' }}>📍 {address.fullName} | {address.mobile}</p>
                            <p style={{ color: '#555', margin: 0 }}>{address.address}, {address.city}, {address.state} - {address.pincode}</p>
                        </div>
                        <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '15px' }}>💳 {payment.method}</p>

                        {cartItems.map(item => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '13px', color: '#555' }}>
                                <span>{item.product?.name} × {item.quantity}</span>
                                <span>₹{(item.product?.price * item.quantity).toLocaleString()}</span>
                            </div>
                        ))}

                        <div style={{ borderTop: '1px solid #e0e0e0', marginTop: '15px', paddingTop: '15px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#878787' }}><span>Subtotal</span><span>₹{total.toLocaleString()}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#878787' }}><span>GST (18%)</span><span>₹{tax.toLocaleString()}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#388e3c' }}><span>Delivery</span><span>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '800', color: '#212121', paddingTop: '10px', borderTop: '2px solid #212121', marginTop: '10px' }}>
                                <span>Total</span><span>₹{grandTotal.toLocaleString()}</span>
                            </div>
                        </div>

                        <button onClick={handlePlaceOrder}
                            style={{ width: '100%', marginTop: '20px', padding: '16px', background: '#ff9f00', color: 'white', border: 'none', borderRadius: '2px', fontWeight: '700', fontSize: '18px', cursor: 'pointer', fontFamily: "'Inter', sans-serif'" }}>
                            🎉 Place Order • ₹{grandTotal.toLocaleString()}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CheckoutPage;