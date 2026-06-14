import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { getToken, getCurrentUser } from '../services/api';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
const API_URL = 'http://localhost:8080/api';

function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [scrolled, setScrolled] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const user = getCurrentUser();
    const token = getToken();
	const theme = useTheme();
	const c = theme.colors;

    useEffect(() => {
        if (user) loadOrders();
        window.addEventListener('scroll', () => setScrolled(window.scrollY > 50));
        return () => window.removeEventListener('scroll', () => {});
    }, [user]);

    const loadOrders = async () => {
        try {
            const res = await axios.get(`${API_URL}/orders/user/${user.userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(Array.isArray(res.data) ? res.data : []);
        } catch (err) {} finally { setLoading(false); }
    };

    const filteredByStatus = activeFilter === 'all' ? orders : orders.filter(o => o.status === activeFilter);
    const filteredOrders = searchQuery
        ? filteredByStatus.filter(o => o.id.toString().includes(searchQuery) || o.status?.toLowerCase().includes(searchQuery.toLowerCase()))
        : filteredByStatus;

    const statusConfig = {
        'CONFIRMED': { bg: '#ecfdf5', color: '#059669', dot: '#10b981', label: 'Confirmed' },
        'PENDING': { bg: '#fffbeb', color: '#d97706', dot: '#f59e0b', label: 'Pending' },
        'SHIPPED': { bg: '#eef2ff', color: '#4f46e5', dot: '#6366f1', label: 'Shipped' },
        'DELIVERED': { bg: '#f0fdf4', color: '#16a34a', dot: '#22c55e', label: 'Delivered' },
        'CANCELLED': { bg: '#fef2f2', color: '#dc2626', dot: '#ef4444', label: 'Cancelled' },
    };

    const getProgressWidth = (status) => {
        const map = { 'CONFIRMED': '25%', 'SHIPPED': '50%', 'DELIVERED': '100%' };
        return map[status] || '0%';
    };

    if (!token) return <Navigate to="/login" />;

    return (
        <div style={{ background: '#faf8ff', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
            
            {/* NAVBAR */}
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                padding: scrolled ? '6px 0' : '12px 0',
                background: scrolled ? 'rgba(255,255,255,0.97)' : '#fff',
                backdropFilter: scrolled ? 'blur(20px)' : 'none',
                borderBottom: '1px solid #e9d5ff', transition: 'all 0.3s ease',
            }}>
                <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link to="/home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '15px' }}>E</div>
                        <span style={{ fontSize: '20px', fontWeight: '800', color: '#1a0a2e', letterSpacing: '-0.5px' }}>e-shop</span>
                    </Link>
					
                    <div style={{ display: 'flex', gap: '25px', fontSize: '13px', fontWeight: '500' }}>
                        {['Home', 'Cart', 'Orders'].map(l => (
                            <Link key={l} to={`/${l.toLowerCase() === 'home' ? 'home' : l.toLowerCase()}`} style={{
                                color: l === 'Orders' ? '#4c1d95' : '#6b7280', textDecoration: 'none',
                                fontWeight: l === 'Orders' ? '600' : '500',
                                padding: '6px 12px', borderRadius: '8px', transition: 'all 0.2s',
                            }}
                                onMouseEnter={e => { e.target.style.background = '#f5f0ff'; e.target.style.color = '#4c1d95'; }}
                                onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = l === 'Orders' ? '#4c1d95' : '#6b7280'; }}
                            >{l}</Link>
							
                        ))}
                    </div>
                </div>
            </nav>
			

            <div style={{ maxWidth: '1300px', margin: '90px auto 50px', padding: '0 30px' }}>

                {/* PAGE HEADER */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
                    <div>
                        <p style={{ fontSize: '12px', fontWeight: '700', color: '#7c3aed', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>Order History</p>
                        <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#1a0a2e', letterSpacing: '-0.5px', marginBottom: '8px' }}>My Orders</h1>
                        <p style={{ color: '#6b7280', fontSize: '15px' }}>Track and manage all your purchases in one place</p>
                    </div>
                    
                    {/* Search */}
                    <div style={{ position: 'relative', width: '280px' }}>
                        <input type="text" placeholder="Search by order ID..." value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%', padding: '12px 16px 12px 42px', borderRadius: '12px',
                                border: '2px solid #e9d5ff', outline: 'none', fontSize: '13px',
                                fontFamily: "'Inter', sans-serif", background: '#fff', color: '#1a0a2e',
                                boxSizing: 'border-box', transition: 'all 0.3s'
                            }}
                            onFocus={e => e.target.style.borderColor = '#7c3aed'}
                            onBlur={e => e.target.style.borderColor = '#e9d5ff'}
                        />
                        <span style={{ position: 'absolute', left: '14px', top: '13px', fontSize: '15px', color: '#6b7280' }}>🔍</span>
                    </div>
                </div>

                {/* FILTER TABS */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '35px', flexWrap: 'wrap' }}>
                    {[
                        { id: 'all', label: 'All Orders', count: orders.length },
                        { id: 'CONFIRMED', label: 'Confirmed', count: orders.filter(o => o.status === 'CONFIRMED').length },
                        { id: 'SHIPPED', label: 'Shipped', count: orders.filter(o => o.status === 'SHIPPED').length },
                        { id: 'DELIVERED', label: 'Delivered', count: orders.filter(o => o.status === 'DELIVERED').length },
                    ].map(f => (
                        <button key={f.id} onClick={() => setActiveFilter(f.id)} style={{
                            padding: '10px 20px', borderRadius: '10px', border: activeFilter === f.id ? '2px solid #7c3aed' : '1px solid #e9d5ff',
                            background: activeFilter === f.id ? '#f5f0ff' : '#fff',
                            color: activeFilter === f.id ? '#4c1d95' : '#6b7280',
                            fontWeight: '600', fontSize: '13px', cursor: 'pointer',
                            fontFamily: "'Inter', sans-serif", transition: 'all 0.3s',
                            display: 'flex', alignItems: 'center', gap: '8px'
                        }}>
                            {f.label}
                            <span style={{
                                padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '700',
                                background: activeFilter === f.id ? 'rgba(76,29,149,0.15)' : '#f5f0ff',
                                color: activeFilter === f.id ? '#4c1d95' : '#6b7280'
                            }}>{f.count}</span>
                        </button>
                    ))}
                </div>

                {/* LOADING */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px 30px' }}>
                        <div style={{ width: '44px', height: '44px', border: '3px solid #e9d5ff', borderTopColor: '#7c3aed', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 20px' }}></div>
                        <p style={{ color: '#6b7280', fontSize: '15px', fontWeight: '500' }}>Loading your orders...</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    /* EMPTY STATE */
                    <div style={{ textAlign: 'center', padding: '100px 30px', background: '#fff', borderRadius: '24px', border: '1px solid #e9d5ff', boxShadow: '0 10px 40px rgba(76,29,149,0.04)' }}>
                        <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, #f5f0ff, #ede4ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px', fontSize: '40px' }}>📦</div>
                        <h3 style={{ color: '#1a0a2e', fontSize: '24px', fontWeight: '700', marginBottom: '10px' }}>No orders found</h3>
                        <p style={{ color: '#6b7280', fontSize: '15px', marginBottom: '30px', maxWidth: '400px', margin: '0 auto 30px' }}>
                            {activeFilter !== 'all' ? `You don't have any ${activeFilter.toLowerCase()} orders yet.` : 'Start shopping to see your orders here.'}
                        </p>
                        <Link to="/home" style={{
                            padding: '14px 32px', background: 'linear-gradient(135deg, #4c1d95, #7c3aed)',
                            color: '#fff', borderRadius: '12px', textDecoration: 'none', fontWeight: '600',
                            fontSize: '15px', display: 'inline-block', boxShadow: '0 8px 25px rgba(76,29,149,0.2)',
                            transition: 'all 0.3s', fontFamily: "'Inter', sans-serif"
                        }}
                            onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 12px 35px rgba(76,29,149,0.3)'; }}
                            onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 8px 25px rgba(76,29,149,0.2)'; }}
                        >Browse Products</Link>
                    </div>
                ) : (
                    /* ORDERS LIST */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {filteredOrders.map(order => {
                            const sc = statusConfig[order.status] || statusConfig['PENDING'];
                            const orderDate = new Date(order.createdAt);
                            const progressWidth = getProgressWidth(order.status);

                            return (
                                <div key={order.id} style={{
                                    background: '#fff', borderRadius: '20px', border: '1px solid #e9d5ff',
                                    overflow: 'hidden', boxShadow: '0 4px 20px rgba(76,29,149,0.03)',
                                    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                                }}
                                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 16px 50px rgba(76,29,149,0.1)'}
                                    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(76,29,149,0.03)'}>
                                    
                                    {/* TOP ROW */}
                                    <div style={{ padding: '22px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div>
                                                <span style={{ color: '#6b7280', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>Order ID</span>
                                                <span style={{ fontWeight: '700', color: '#1a0a2e', fontSize: '17px' }}>#{order.id}</span>
                                            </div>
                                            <div style={{ width: '1px', height: '30px', background: '#e9d5ff' }}></div>
                                            <div>
                                                <span style={{ color: '#6b7280', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>Date</span>
                                                <span style={{ fontWeight: '600', color: '#1a0a2e', fontSize: '14px' }}>
                                                    {orderDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                            <div style={{ textAlign: 'right' }}>
                                                <span style={{ color: '#6b7280', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>Total</span>
                                                <span style={{ fontWeight: '800', color: '#1a0a2e', fontSize: '20px' }}>₹{Number(order.totalAmount).toLocaleString()}</span>
                                            </div>
                                            <span style={{
                                                padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '700',
                                                background: sc.bg, color: sc.color, display: 'flex', alignItems: 'center', gap: '6px',
                                                border: `1px solid ${sc.dot}20`
                                            }}>
                                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: sc.dot }}></span>
                                                {sc.label}
                                            </span>
                                        </div>
                                    </div>

                                    {/* PROGRESS BAR */}
                                    <div style={{ padding: '0 30px 20px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            {['Order Placed', 'Processing', 'Shipped', 'Delivered'].map((step, i) => {
                                                const steps = ['CONFIRMED', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];
                                                const completed = ['DELIVERED'].includes(order.status) ||
                                                    (order.status === 'SHIPPED' && i <= 2) ||
                                                    (order.status === 'CONFIRMED' && i <= 1);
                                                return (
                                                    <div key={i} style={{ textAlign: 'center', flex: 1 }}>
                                                        <div style={{
                                                            width: '24px', height: '24px', borderRadius: '50%',
                                                            background: completed ? sc.color : '#e9d5ff',
                                                            color: completed ? '#fff' : '#6b7280',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            margin: '0 auto 6px', fontSize: '11px', fontWeight: '700',
                                                            transition: 'all 0.5s'
                                                        }}>{completed ? '✓' : i + 1}</div>
                                                        <span style={{ fontSize: '10px', color: completed ? sc.color : '#6b7280', fontWeight: completed ? '600' : '400', whiteSpace: 'nowrap' }}>{step}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div style={{ height: '5px', background: '#e9d5ff', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{ height: '100%', background: `linear-gradient(90deg, ${sc.color}, ${sc.dot})`, borderRadius: '3px', width: progressWidth, transition: 'width 1s ease' }}></div>
                                        </div>
                                    </div>

                                    {/* ITEMS ROW */}
                                    <div style={{ padding: '15px 30px', borderTop: '1px solid #f5f0ff', borderBottom: '1px solid #f5f0ff', display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
                                        {order.items?.slice(0, 4).map(item => (
                                            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#faf8ff', padding: '10px 16px', borderRadius: '12px', border: '1px solid #f5f0ff' }}>
                                                <div style={{ width: '44px', height: '44px', borderRadius: '10px', overflow: 'hidden', background: '#f5f0ff', flexShrink: 0 }}>
                                                    <img src={item.product?.imageUrl?.startsWith('/uploads') ? `http://localhost:8080${item.product.imageUrl}` : 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=80&q=80'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>
                                                <div>
                                                    <p style={{ fontWeight: '600', color: '#1a0a2e', fontSize: '13px', marginBottom: '2px', maxWidth: '120px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.product?.name}</p>
                                                    <p style={{ color: '#6b7280', fontSize: '11px' }}>₹{Number(item.price).toLocaleString()} × {item.quantity}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {order.items?.length > 4 && (
                                            <span style={{ color: '#6b7280', fontSize: '13px', fontWeight: '600', background: '#f5f0ff', padding: '8px 14px', borderRadius: '10px' }}>
                                                +{order.items.length - 4} more
                                            </span>
                                        )}
                                    </div>

                                    {/* FOOTER */}
                                    <div style={{ padding: '16px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                                        <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: '#6b7280' }}>
                                            <span>💳 {order.paymentMethod === 'COD' ? 'Cash on Delivery' : order.paymentMethod}</span>
                                            <span>📦 {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <Link to={`/order-success?id=${order.id}`} style={{
                                                padding: '9px 20px', background: '#fff', color: '#4c1d95',
                                                border: '1px solid #e9d5ff', borderRadius: '10px', textDecoration: 'none',
                                                fontWeight: '600', fontSize: '13px', fontFamily: "'Inter', sans-serif",
                                                transition: 'all 0.2s'
                                            }}
                                                onMouseEnter={e => { e.target.style.background = '#f5f0ff'; e.target.style.borderColor = '#7c3aed'; }}
                                                onMouseLeave={e => { e.target.style.background = '#fff'; e.target.style.borderColor = '#e9d5ff'; }}
                                            >View Details</Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* FOOTER */}
            <footer style={{ background: '#fff', borderTop: '1px solid #e9d5ff', padding: '20px 30px', textAlign: 'center', fontSize: '12px', color: '#6b7280', fontFamily: "'Inter', sans-serif", marginTop: '60px' }}>
                © 2026 e-shop. All rights reserved. • <span style={{ color: '#4c1d95', fontWeight: '600', cursor: 'pointer' }}>Returns Policy</span> • <span style={{ color: '#4c1d95', fontWeight: '600', cursor: 'pointer' }}>Help Center</span>
            </footer>
        </div>
    );
}

export default OrdersPage;