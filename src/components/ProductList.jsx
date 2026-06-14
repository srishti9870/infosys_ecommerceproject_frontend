import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getToken } from '../services/api';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { Navigate } from 'react-router-dom';

const API_URL = 'http://localhost:8080/api';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const token = getToken();
    const theme = useTheme();
    const c = theme.colors;

    const searchQuery = searchParams.get('search') || '';
    const categoryFilter = searchParams.get('category') || '';

    useEffect(() => {
        loadProducts();
    }, [searchQuery, categoryFilter]);

    const loadProducts = async () => {
        setLoading(true);
        try {
            let url = `${API_URL}/products?page=0&size=20`;
            if (searchQuery) url += `&keyword=${searchQuery}`;
            if (categoryFilter) url += `&category=${categoryFilter}`;

            const res = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = res.data.products || res.data || [];
            setProducts(Array.isArray(data) ? data : []);
        } catch (err) {
            setProducts([]);
        } finally { setLoading(false); }
    };

    const getImage = (cat) => {
        const imgs = {
            'Smartphones': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80',
            'Electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=80',
            'Laptops': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80',
            'Fashion': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&q=80',
            'Sports': 'https://images.unsplash.com/photo-1461896836934-bd45ba4fcf69?w=500&q=80',
            'Audio': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
            'Wearables': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
            'Beauty': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc8?w=500&q=80',
            'Home': 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=500&q=80',
            'Books': 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500&q=80',
            'Gaming': 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500&q=80',
        };
        return imgs[cat] || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=500&q=80';
    };

    if (!token) return <Navigate to="/login" />;

    return (
        <div style={{ background: c.bg, minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: c.text }}>
            
            {/* HEADER */}
            <div style={{ background: c.card, borderBottom: `1px solid ${c.border}`, padding: '16px 30px' }}>
                <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link to="/home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: c.primary, color: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '15px' }}>E</div>
                        <span style={{ fontSize: '20px', fontWeight: '800', color: c.text }}>e-shop</span>
                    </Link>
                    <Link to="/home" style={{ color: c.text2, textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>← Back to Home</Link>
                </div>
            </div>

            <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '30px' }}>
                
                {/* Title */}
                <div style={{ marginBottom: '30px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: '800', color: c.text }}>
                        {categoryFilter ? categoryFilter : searchQuery ? `Results for "${searchQuery}"` : 'All Products'}
                    </h1>
                    <p style={{ color: c.text2, fontSize: '14px', marginTop: '5px' }}>
                        {loading ? 'Loading...' : `${products.length} product${products.length !== 1 ? 's' : ''} found`}
                    </p>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '80px', color: c.text2 }}>Loading products...</div>
                ) : products.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '100px 30px', background: c.card, borderRadius: '20px', border: `1px solid ${c.border}` }}>
                        <div style={{ fontSize: '60px', marginBottom: '15px' }}>📦</div>
                        <h3 style={{ fontSize: '20px', fontWeight: '700', color: c.text }}>No products found</h3>
                        <p style={{ color: c.text2, fontSize: '14px', marginBottom: '20px' }}>Try a different category or search term</p>
                        <Link to="/home" style={{ color: c.primary, textDecoration: 'none', fontWeight: '600' }}>← Back to Home</Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '22px' }}>
                        {products.map(p => (
                            <Link to={`/product/${p.id}`} key={p.id} style={{ textDecoration: 'none' }}>
                                <div style={{ background: c.card, borderRadius: '16px', overflow: 'hidden', border: `1px solid ${c.border}`, transition: 'all 0.35s', cursor: 'pointer' }}
                                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.1)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                                    <div style={{ height: '220px', overflow: 'hidden', background: c.bg2 }}>
                                        <img src={p.imageUrl?.startsWith('/uploads') ? `http://localhost:8080${p.imageUrl}` : getImage(p.category)} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ padding: '18px' }}>
                                        <span style={{ fontSize: '10px', fontWeight: '700', color: c.primary, textTransform: 'uppercase', letterSpacing: '1px' }}>{p.category}</span>
                                        <h4 style={{ fontSize: '15px', fontWeight: '600', color: c.text, margin: '6px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</h4>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '18px', fontWeight: '700', color: c.text }}>₹{Number(p.price).toLocaleString()}</span>
                                            <span style={{ fontSize: '11px', fontWeight: '600', color: p.stockQuantity > 0 ? '#059669' : '#dc2626' }}>
                                                {p.stockQuantity > 0 ? 'In Stock' : 'Out'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductList;