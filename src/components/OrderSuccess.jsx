import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, Navigate } from 'react-router-dom';
import { getToken } from '../services/api';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
const API_URL = 'http://localhost:8080/api';

function OrderSuccess() {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('id');
    const token = getToken();
	const theme = useTheme();
	const c = theme.colors;

    useEffect(() => {
        if (orderId && token) loadOrder();
    }, [orderId, token]);

    const loadOrder = async () => {
        try {
            const res = await axios.get(`${API_URL}/orders/detail/${orderId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = res.data;
            setOrder(data.order || data);
        } catch (err) {} finally { setLoading(false); }
    };

    if (!token) return <Navigate to="/login" />;

    if (loading) {
        return (
            <div style={{ background: '#faf8ff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '50px', height: '50px', border: '4px solid #e9d5ff', borderTop: '4px solid #7c3aed', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 15px' }}></div>
                    <p style={{ color: '#6b7280', fontSize: '15px' }}>Loading order details...</p>
                </div>
            </div>
        );
    }

    const orderData = order?.order || order;
    const items = orderData?.items || order?.items || [];
    const subtotal = items.reduce((s, i) => s + (i.price * i.quantity), 0);
    const tax = Math.round(subtotal * 0.18);
    const totalAmount = orderData?.totalAmount || order?.totalAmount || subtotal + tax;

    return (
        <div style={{ background: '#faf8ff', minHeight: '100vh', fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column' }}>
            
            {/* NAVBAR */}
            <nav style={{ background: '#fff', borderBottom: '1px solid #e9d5ff', padding: '14px 30px' }}>
                <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link to="/home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '15px' }}>E</div>
                        <span style={{ fontSize: '20px', fontWeight: '800', color: '#1a0a2e', letterSpacing: '-0.5px' }}>e-shop</span>
                    </Link>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <Link to="/orders" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '13px', fontWeight: '500' }}>Orders</Link>
                        <Link to="/home" style={{ color: '#4c1d95', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>Continue Shopping</Link>
                    </div>
                </div>
            </nav>

            {/* MAIN CONTENT */}
            <div style={{ flex: 1, padding: '40px 30px' }}>
                <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
                    
                    {/* Success Banner */}
                    <div style={{ 
                        background: 'linear-gradient(135deg, #059669, #10b981)', 
                        borderRadius: '24px', padding: '50px 40px', textAlign: 'center', 
                        color: '#fff', marginBottom: '35px',
                        boxShadow: '0 25px 60px rgba(5,150,105,0.2)',
                        position: 'relative', overflow: 'hidden'
                    }}>
                        <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', top: '-15%', right: '-8%' }}></div>
                        <div style={{ position: 'absolute', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', bottom: '-10%', left: '-5%' }}></div>
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px', fontSize: '42px', backdropFilter: 'blur(10px)', border: '3px solid rgba(255,255,255,0.3)' }}>✓</div>
                            <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '10px', letterSpacing: '-0.5px' }}>Order Placed Successfully!</h1>
                            <p style={{ opacity: '0.9', fontSize: '16px', marginBottom: '25px' }}>Thank you for your purchase. Your order has been confirmed and is being processed.</p>
                            <div style={{ padding: '14px 28px', background: 'rgba(255,255,255,0.15)', borderRadius: '12px', display: 'inline-block', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                                <span style={{ opacity: '0.9', fontSize: '14px' }}>Order ID: </span>
                                <span style={{ fontWeight: '800', fontSize: '20px', letterSpacing: '1px' }}>#{orderData?.id || orderId}</span>
                            </div>
                        </div>
                    </div>

                    {/* Two Column Layout */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '25px' }}>
                        
                        {/* Delivery Info */}
                        <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #e9d5ff', padding: '30px', boxShadow: '0 10px 40px rgba(76,29,149,0.05)' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a0a2e', marginBottom: '22px' }}>📦 Delivery Details</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f5f0ff' }}>
                                    <span style={{ color: '#6b7280' }}>Status</span>
                                    <span style={{ color: '#059669', fontWeight: '700', background: '#ecfdf5', padding: '4px 14px', borderRadius: '8px', fontSize: '13px' }}>{orderData?.status || 'CONFIRMED'}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f5f0ff' }}>
                                    <span style={{ color: '#6b7280' }}>Payment Method</span>
                                    <span style={{ color: '#1a0a2e', fontWeight: '600' }}>{orderData?.paymentMethod || 'COD'}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f5f0ff' }}>
                                    <span style={{ color: '#6b7280' }}>Order Date</span>
                                    <span style={{ color: '#1a0a2e', fontWeight: '500' }}>{orderData?.createdAt ? new Date(orderData.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                                    <span style={{ color: '#6b7280' }}>Total Items</span>
                                    <span style={{ color: '#1a0a2e', fontWeight: '600' }}>{items.length} item{items.length !== 1 ? 's' : ''}</span>
                                </div>
                            </div>
                            {orderData?.shippingAddress && (
                                <div style={{ marginTop: '20px', padding: '16px', background: '#faf8ff', borderRadius: '12px', fontSize: '13px', color: '#6b7280', lineHeight: '1.7', border: '1px solid #e9d5ff' }}>
                                    <p style={{ fontWeight: '600', color: '#4c1d95', marginBottom: '6px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>📍 Shipping Address</p>
                                    {orderData.shippingAddress}
                                </div>
                            )}
                        </div>

                        {/* Price Summary */}
                        <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #e9d5ff', padding: '30px', boxShadow: '0 10px 40px rgba(76,29,149,0.05)' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a0a2e', marginBottom: '22px' }}>💰 Price Summary</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f5f0ff' }}>
                                    <span style={{ color: '#6b7280' }}>Subtotal ({items.length} items)</span>
                                    <span style={{ color: '#1a0a2e', fontWeight: '500' }}>₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f5f0ff' }}>
                                    <span style={{ color: '#6b7280' }}>GST (18%)</span>
                                    <span style={{ color: '#1a0a2e', fontWeight: '500' }}>₹{tax.toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f5f0ff' }}>
                                    <span style={{ color: '#6b7280' }}>Delivery</span>
                                    <span style={{ color: '#059669', fontWeight: '600' }}>FREE</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0 0', marginTop: '8px', borderTop: '2px solid #1a0a2e' }}>
                                    <span style={{ fontWeight: '700', fontSize: '18px', color: '#1a0a2e' }}>Total Amount</span>
                                    <span style={{ fontWeight: '800', fontSize: '22px', color: '#4c1d95' }}>₹{Number(totalAmount).toLocaleString()}</span>
                                </div>
                            </div>
                            <div style={{ marginTop: '20px', padding: '14px', background: '#f0fdf4', borderRadius: '10px', textAlign: 'center', color: '#059669', fontSize: '13px', fontWeight: '600' }}>
                                🎉 You saved ₹50 on delivery!
                            </div>
                        </div>
                    </div>

                    {/* Items Ordered */}
                    {items.length > 0 && (
                        <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #e9d5ff', padding: '30px', marginBottom: '30px', boxShadow: '0 10px 40px rgba(76,29,149,0.05)' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a0a2e', marginBottom: '22px' }}>🛒 Items Ordered</h3>
                            <div style={{ display: 'grid', gap: '12px' }}>
                                {items.map((item, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#faf8ff', borderRadius: '12px', border: '1px solid #f5f0ff' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <div style={{ width: '55px', height: '55px', borderRadius: '10px', overflow: 'hidden', background: '#f5f0ff', flexShrink: 0 }}>
                                                <img src={item.product?.imageUrl?.startsWith('/uploads') ? `http://localhost:8080${item.product.imageUrl}` : 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=100&q=80'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                            <div>
                                                <p style={{ fontWeight: '600', color: '#1a0a2e', fontSize: '15px', marginBottom: '3px' }}>{item.product?.name}</p>
                                                <p style={{ color: '#6b7280', fontSize: '13px' }}>Qty: {item.quantity} × ₹{Number(item.price).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <span style={{ fontWeight: '700', color: '#4c1d95', fontSize: '16px' }}>₹{Number(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                        <Link to="/orders" style={{
                            padding: '16px 36px', background: '#fff', color: '#4c1d95', 
                            border: '2px solid #e9d5ff', borderRadius: '14px', textDecoration: 'none', 
                            fontWeight: '600', fontSize: '15px', transition: 'all 0.3s',
                            fontFamily: "'Inter', sans-serif"
                        }}
                            onMouseEnter={e => { e.target.style.background = '#f5f0ff'; e.target.style.borderColor = '#7c3aed'; }}
                            onMouseLeave={e => { e.target.style.background = '#fff'; e.target.style.borderColor = '#e9d5ff'; }}
                        >📋 View All Orders</Link>
                        <Link to="/home" style={{
                            padding: '16px 36px', background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', 
                            color: '#fff', borderRadius: '14px', textDecoration: 'none', 
                            fontWeight: '600', fontSize: '15px', boxShadow: '0 8px 30px rgba(76,29,149,0.25)',
                            transition: 'all 0.3s', fontFamily: "'Inter', sans-serif"
                        }}
                            onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 12px 35px rgba(76,29,149,0.35)'; }}
                            onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 8px 30px rgba(76,29,149,0.25)'; }}
                        >🛍️ Continue Shopping</Link>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer style={{ background: '#fff', borderTop: '1px solid #e9d5ff', padding: '20px', textAlign: 'center', fontSize: '12px', color: '#6b7280', fontFamily: "'Inter', sans-serif" }}>
                © 2026 e-shop. All rights reserved. • Need help? <span style={{ color: '#4c1d95', fontWeight: '600', cursor: 'pointer' }}>Contact Support</span>
            </footer>
        </div>
    );
}

export default OrderSuccess;