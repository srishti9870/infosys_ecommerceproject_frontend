import React, { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { getToken, getCurrentUser } from '../services/api';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = getCurrentUser();
    const token = getToken();
    const navigate = useNavigate();

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

    const total = cartItems.reduce((sum, item) => sum + (item.product?.price * item.quantity), 0);

    if (!token) return <Navigate to="/login" />;

    return (
        <div style={{ background: '#f1f2f4', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
            {/* Header */}
            <div style={{ background: '#2874f0', padding: '15px 30px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/home" style={{ color: 'white', textDecoration: 'none', fontSize: '20px', fontWeight: '800' }}>e-shop</Link>
                <span style={{ fontSize: '16px', fontWeight: '600' }}>Shopping Cart ({cartItems.length})</span>
            </div>

            <div style={{ maxWidth: '800px', margin: '30px auto', padding: '0 20px' }}>
                
                {loading ? (
                    <p style={{ textAlign: 'center', color: '#878787' }}>Loading cart...</p>
                ) : cartItems.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: '4px' }}>
                        <span style={{ fontSize: '60px' }}>🛒</span>
                        <h3 style={{ color: '#212121', marginTop: '15px' }}>Your cart is empty</h3>
                        <p style={{ color: '#878787', fontSize: '14px' }}>Add items to get started</p>
                        <Link to="/home" style={{ display: 'inline-block', marginTop: '15px', padding: '12px 30px', background: '#2874f0', color: 'white', textDecoration: 'none', borderRadius: '2px', fontWeight: '600' }}>Shop Now</Link>
                    </div>
                ) : (
                    <>
                        {/* Cart Items */}
                        <div style={{ background: 'white', borderRadius: '4px', overflow: 'hidden', marginBottom: '15px' }}>
                            {cartItems.map(item => (
                                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #f0f0f0' }}>
                                    <div>
                                        <h4 style={{ margin: '0 0 5px', color: '#212121', fontSize: '15px' }}>{item.product?.name}</h4>
                                        <p style={{ margin: 0, color: '#878787', fontSize: '13px' }}>Qty: {item.quantity} × ₹{Number(item.product?.price).toLocaleString()}</p>
                                    </div>
                                    <span style={{ fontWeight: '700', color: '#212121', fontSize: '16px' }}>
                                        ₹{Number(item.product?.price * item.quantity).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Total + Checkout Button */}
                        <div style={{ background: 'white', borderRadius: '4px', padding: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #f0f0f0' }}>
                                <span style={{ fontSize: '16px', fontWeight: '700', color: '#212121' }}>Total Amount</span>
                                <span style={{ fontSize: '22px', fontWeight: '800', color: '#212121' }}>₹{total.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                <span style={{ fontSize: '13px', color: '#388e3c' }}>🚚 Free Delivery</span>
                                <span style={{ fontSize: '13px', color: '#878787' }}>inclusive of all taxes</span>
                            </div>
                            <button 
                                onClick={() => navigate('/checkout')}
                                style={{ 
                                    width: '100%', marginTop: '20px', padding: '16px', 
                                    background: '#ff9f00', color: 'white', border: 'none', 
                                    borderRadius: '2px', fontWeight: '700', fontSize: '18px', 
                                    cursor: 'pointer', fontFamily: "'Inter', sans-serif" 
                                }}>
                                Proceed to Checkout • ₹{total.toLocaleString()}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default CartPage;