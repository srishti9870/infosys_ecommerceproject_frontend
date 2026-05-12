import React, { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { getToken, getCurrentUser } from '../services/api';

import axios from 'axios';

const API_URL = 'http://localhost:58514/api';

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

    // UPDATE QUANTITY
    const updateQuantity = async (id, newQty) => {
        if (newQty < 1) return;
        try {
            await axios.put(`${API_URL}/cart/${id}`, { quantity: newQty }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            loadCart();
        } catch (err) {
            alert('Failed to update');
        }
    };

	const handlePlaceOrder = async () => {
	    try {
	        const response = await axios.post(`${API_URL}/orders/checkout/${user.userId}`, {
	            shippingAddress: "User Address",
	            paymentMethod: "COD"
	        }, {
	            headers: { Authorization: `Bearer ${token}` }
	        });
	        alert('Order placed successfully!');
	        loadCart();
	    } catch (err) {
	        alert('Failed to place order');
	    }
	};
    // DELETE ITEM
    const removeItem = async (id) => {
        try {
            await axios.delete(`${API_URL}/cart/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            loadCart();
        } catch (err) {
            alert('Failed to remove');
        }
    };

    const total = cartItems.reduce((sum, item) => sum + (item.product?.price * item.quantity), 0);

    if (!token) return <Navigate to="/login" />;

    return (
        <div style={{ background: '#f1f2f4', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
            <div style={{ background: '#2874f0', padding: '15px 30px', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
                <Link to="/home" style={{ color: 'white', textDecoration: 'none', fontSize: '20px', fontWeight: '800' }}>e-shop</Link>
                <span style={{ fontSize: '18px', fontWeight: '600' }}>Shopping Cart</span>
            </div>

            <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '0 20px' }}>
                {loading ? (
                    <p style={{ textAlign: 'center', color: '#878787', fontSize: '16px' }}>Loading cart...</p>
                ) : cartItems.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px', background: 'white', borderRadius: '4px' }}>
                        <p style={{ fontSize: '50px' }}>🛒</p>
                        <h3 style={{ color: '#212121' }}>Your cart is empty</h3>
                        <Link to="/home" style={{ color: '#2874f0', textDecoration: 'none', fontWeight: '600' }}>Continue Shopping</Link>
                    </div>
                ) : (
                    <>
                        <div style={{ background: 'white', borderRadius: '4px', overflow: 'hidden' }}>
                            {cartItems.map(item => (
                                <div key={item.id} style={{ display: 'flex', alignItems: 'center', padding: '20px', borderBottom: '1px solid #f0f0f0', gap: '20px' }}>
                                    <div style={{ width: '80px', height: '80px', background: '#f5f5f5', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', flexShrink: 0 }}>
                                        📦
                                    </div>
                                    <div style={{ flex: 1, minWidth: '200px' }}>
                                        <h4 style={{ margin: '0 0 5px', color: '#212121', fontSize: '15px' }}>{item.product?.name}</h4>
                                        <p style={{ margin: '0 0 8px', color: '#878787', fontSize: '13px' }}>₹{Number(item.product?.price).toLocaleString()} each</p>
                                        
                                        {/* QUANTITY SELECTOR */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                style={{ width: '28px', height: '28px', border: '1px solid #e0e0e0', background: '#f5f5f5', cursor: 'pointer', borderRadius: '2px', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                                            <span style={{ fontWeight: '700', fontSize: '14px', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                style={{ width: '28px', height: '28px', border: '1px solid #e0e0e0', background: '#f5f5f5', cursor: 'pointer', borderRadius: '2px', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: '700', color: '#212121', fontSize: '16px', textAlign: 'right', minWidth: '100px' }}>
                                        ₹{Number(item.product?.price * item.quantity).toLocaleString()}
                                    </div>
									<button onClick={handlePlaceOrder}
									    style={{ padding: '14px 40px', background: '#ff9f00', color: 'white', border: 'none', borderRadius: '2px', fontWeight: '700', fontSize: '16px', cursor: 'pointer', fontFamily: "'Inter', sans-serif'" }}>
									    Place Order
									</button>
                                </div>
                            ))}
                        </div>

                        {/* TOTAL */}
                        <div style={{ background: 'white', borderRadius: '4px', padding: '20px', marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                            <div>
                                <span style={{ color: '#878787', fontSize: '14px' }}>Total ({cartItems.length} items): </span>
                                <span style={{ fontSize: '24px', fontWeight: '800', color: '#212121' }}>₹{total.toLocaleString()}</span>
                            </div>
                            <button style={{ padding: '14px 40px', background: '#ff9f00', color: 'white', border: 'none', borderRadius: '2px', fontWeight: '700', fontSize: '16px', cursor: 'pointer', fontFamily: "'Inter', sans-serif'" }}>
                                Place Order
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default CartPage;