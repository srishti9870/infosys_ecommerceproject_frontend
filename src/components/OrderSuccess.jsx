import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getToken } from '../services/api';
import axios from 'axios';

const API_URL = 'http://localhost:64002/api';

function OrderSuccess() {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('id');
    const token = getToken();

    useEffect(() => {
        if (orderId && token) loadOrder();
    }, [orderId, token]);

    const loadOrder = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/orders/detail/${orderId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrder(response.data.order);
        } catch (err) {
            console.error('Failed to load order:', err);
            setError('Failed to load order details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ background: '#f1f2f4', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" }}>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '18px', color: '#878787' }}>Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div style={{ background: '#f1f2f4', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" }}>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '18px', color: '#e74c3c' }}>{error || 'Order not found'}</p>
                    <Link to="/home" style={{ color: '#2874f0', textDecoration: 'none', fontWeight: '600' }}>Go to Home</Link>
                </div>
            </div>
        );
    }

    const items = order.items || [];
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.18;
    const delivery = 0;

    return (
        <div style={{ background: '#f1f2f4', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
            <div style={{ background: '#2874f0', padding: '15px 30px', color: 'white', textAlign: 'center' }}>
                <Link to="/home" style={{ color: 'white', textDecoration: 'none', fontSize: '20px', fontWeight: '800' }}>e-shop</Link>
            </div>

            <div style={{ maxWidth: '700px', margin: '30px auto', padding: '0 20px' }}>
                
                <div style={{ background: '#E8F5E9', padding: '25px', borderRadius: '4px', textAlign: 'center', marginBottom: '20px', border: '1px solid #C8E6C9' }}>
                    <span style={{ fontSize: '50px' }}>✅</span>
                    <h2 style={{ color: '#2E7D32', margin: '10px 0', fontSize: '22px' }}>Order Placed Successfully!</h2>
                    <p style={{ color: '#666', fontSize: '14px' }}>Order ID: #{order.id}</p>
                </div>

                <div style={{ background: 'white', borderRadius: '4px', padding: '25px', marginBottom: '15px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#212121', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
                        📋 Order Summary
                    </h3>

                    {items.map((item, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f8f8f8', fontSize: '14px' }}>
                            <div>
                                <span style={{ fontWeight: '600', color: '#212121' }}>{item.product?.name}</span>
                                <span style={{ color: '#878787', marginLeft: '10px', fontSize: '12px' }}>× {item.quantity}</span>
                            </div>
                            <span style={{ fontWeight: '600', color: '#212121' }}>
                                ₹{Number(item.price * item.quantity).toLocaleString()}
                            </span>
                        </div>
                    ))}

                    <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #f0f0f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: '14px', color: '#878787' }}>
                            <span>Subtotal</span>
                            <span>₹{subtotal.toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: '14px', color: '#878787' }}>
                            <span>GST (18%)</span>
                            <span>₹{tax.toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: '14px', color: '#388e3c' }}>
                            <span>Delivery</span>
                            <span>FREE</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0 0', marginTop: '10px', borderTop: '2px solid #212121', fontSize: '18px', fontWeight: '800', color: '#212121' }}>
                        <span>Total Amount</span>
                        <span>₹{Number(order.totalAmount).toLocaleString()}</span>
                    </div>
                </div>

                <div style={{ background: 'white', borderRadius: '4px', padding: '25px', marginBottom: '15px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#212121', marginBottom: '15px' }}>📦 Delivery Details</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                        <div>
                            <span style={{ color: '#878787' }}>Status: </span>
                            <span style={{ color: '#388e3c', fontWeight: '700' }}>{order.status}</span>
                        </div>
                        <div>
                            <span style={{ color: '#878787' }}>Payment: </span>
                            <span style={{ color: '#212121', fontWeight: '600' }}>{order.paymentMethod}</span>
                        </div>
                        <div>
                            <span style={{ color: '#878787' }}>Date: </span>
                            <span style={{ color: '#212121', fontWeight: '600' }}>{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div>
                            <span style={{ color: '#878787' }}>Items: </span>
                            <span style={{ color: '#212121', fontWeight: '600' }}>{items.length}</span>
                        </div>
                    </div>
                    <div style={{ marginTop: '12px', fontSize: '13px' }}>
                        <span style={{ color: '#878787' }}>Address: </span>
                        <span style={{ color: '#212121', fontWeight: '600' }}>{order.shippingAddress}</span>
                    </div>
                </div>

                <div style={{ textAlign: 'center', display: 'flex', gap: '15px', justifyContent: 'center' }}>
                    <Link to="/home" style={{ padding: '14px 30px', background: '#2874f0', color: 'white', textDecoration: 'none', borderRadius: '2px', fontWeight: '600', fontSize: '15px' }}>
                        Continue Shopping
                    </Link>
                    <Link to="/cart" style={{ padding: '14px 30px', background: 'white', color: '#2874f0', textDecoration: 'none', borderRadius: '2px', fontWeight: '600', fontSize: '15px', border: '1px solid #2874f0' }}>
                        View Cart
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default OrderSuccess;