import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { getToken, getCurrentUser } from '../services/api';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = getCurrentUser();
    const token = getToken();

    useEffect(() => {
        if (user) loadOrders();
    }, [user]);

    const loadOrders = async () => {
        try {
            const response = await axios.get(`${API_URL}/orders/user/${user.userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(response.data);
        } catch (err) {
            console.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    if (!token) return <Navigate to="/login" />;

    return (
        <div style={{ background: '#f1f2f4', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
            <div style={{ background: '#2874f0', padding: '15px 30px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/home" style={{ color: 'white', textDecoration: 'none', fontSize: '20px', fontWeight: '800' }}>e-shop</Link>
                <span style={{ fontSize: '16px', fontWeight: '600' }}>My Orders</span>
            </div>

            <div style={{ maxWidth: '900px', margin: '30px auto', padding: '0 20px' }}>
                
                {loading ? (
                    <p style={{ textAlign: 'center', color: '#878787' }}>Loading orders...</p>
                ) : orders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: '4px' }}>
                        <span style={{ fontSize: '60px' }}>📋</span>
                        <h3 style={{ color: '#212121', marginTop: '15px' }}>No orders yet</h3>
                        <p style={{ color: '#878787', fontSize: '14px' }}>Start shopping to see your orders here</p>
                        <Link to="/home" style={{ display: 'inline-block', marginTop: '15px', padding: '12px 30px', background: '#2874f0', color: 'white', textDecoration: 'none', borderRadius: '2px', fontWeight: '600' }}>Shop Now</Link>
                    </div>
                ) : (
                    <div>
                        <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#212121', marginBottom: '20px' }}>
                            📋 Order History ({orders.length})
                        </h3>
                        {orders.map(order => (
                            <div key={order.id} style={{ background: 'white', borderRadius: '4px', padding: '20px', marginBottom: '15px', border: '1px solid #f0f0f0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #f0f0f0' }}>
                                    <div>
                                        <span style={{ fontWeight: '700', color: '#212121', fontSize: '15px' }}>Order #{order.id}</span>
                                        <span style={{ marginLeft: '15px', padding: '3px 10px', borderRadius: '2px', fontSize: '11px', fontWeight: '700',
                                            background: order.status === 'CONFIRMED' ? '#E8F5E9' : order.status === 'PENDING' ? '#FFF8E1' : '#FFF3F3',
                                            color: order.status === 'CONFIRMED' ? '#2E7D32' : order.status === 'PENDING' ? '#F57F17' : '#C62828'
                                        }}>{order.status}</span>
                                    </div>
                                    <span style={{ fontSize: '18px', fontWeight: '800', color: '#212121' }}>₹{Number(order.totalAmount).toLocaleString()}</span>
                                </div>
                                
                                <div style={{ fontSize: '13px', color: '#878787', marginBottom: '10px' }}>
                                    <span>🛒 {order.items?.length || 0} items</span>
                                    <span style={{ marginLeft: '20px' }}>💳 {order.paymentMethod}</span>
                                    <span style={{ marginLeft: '20px' }}>📅 {new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>

                                {order.items?.slice(0, 3).map(item => (
                                    <div key={item.id} style={{ fontSize: '13px', color: '#555', padding: '4px 0', display: 'flex', justifyContent: 'space-between' }}>
                                        <span>{item.product?.name} × {item.quantity}</span>
                                        <span>₹{Number(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                                
                                <Link to={`/order-success?id=${order.id}`} style={{ display: 'inline-block', marginTop: '10px', color: '#2874f0', textDecoration: 'none', fontWeight: '600', fontSize: '13px' }}>
                                    View Details →
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default OrdersPage;