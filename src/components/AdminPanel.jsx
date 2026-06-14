import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { getProducts, getToken, getCurrentUser } from '../services/api';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';

const API_URL = 'http://localhost:8080/api';

function AdminPanel() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const token = getToken();
    const user = getCurrentUser();
    const theme = useTheme();
    const c = theme.colors;
    const darkGradient = 'linear-gradient(160deg, #1a0a2e, #2d1b4e, #4c1d95)';

    const [formData, setFormData] = useState({
        name: '', description: '', price: '', stockQuantity: '', category: '', imageUrl: ''
    });

    useEffect(() => { loadProducts(); }, []);

	const loadProducts = async () => {
	    try {
	        // Pagination हटाओ - सब products लाओ
	        const res = await axios.get(`${API_URL}/products?page=0&size=100`, {
	            headers: { Authorization: `Bearer ${token}` }
	        });
	        const data = res.data.products || res.data || [];
	        setProducts(Array.isArray(data) ? data : []);
	    } catch (err) {
	        console.log('Error loading products:', err);
	    }
	};

    const handleImageUpload = async () => {
        if (!imageFile) return null;
        const fd = new FormData();
        fd.append('file', imageFile);
        const res = await axios.post(`${API_URL}/images/upload`, fd, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data.imageUrl;
    };

    const handleAdd = async () => {
        let imageUrl = formData.imageUrl;
        if (imageFile) imageUrl = await handleImageUpload();
        await axios.post(`${API_URL}/products`, { ...formData, imageUrl }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setFormData({ name: '', description: '', price: '', stockQuantity: '', category: '', imageUrl: '' });
        setImageFile(null);
        setShowForm(false);
        loadProducts();
    };

    const handleUpdate = async () => {
        await axios.put(`${API_URL}/products/${editingProduct.id}`, editingProduct, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setEditingProduct(null);
        loadProducts();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this product permanently?')) {
            await axios.delete(`${API_URL}/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            loadProducts();
        }
    };

    const filtered = products.filter(p =>
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.toLowerCase().includes(search.toLowerCase())
    );

    const stats = [
        { label: 'Total Products', value: products.length, color: '#7c3aed', bg: '#f5f0ff', icon: '📦' },
        { label: 'In Stock', value: products.filter(p => p.stockQuantity > 0).length, color: '#059669', bg: '#ecfdf5', icon: '✓' },
        { label: 'Low Stock', value: products.filter(p => p.stockQuantity > 0 && p.stockQuantity <= 5).length, color: '#d97706', bg: '#fffbeb', icon: '⚠' },
        { label: 'Out of Stock', value: products.filter(p => p.stockQuantity === 0).length, color: '#dc2626', bg: '#fef2f2', icon: '✕' },
    ];

    const getImage = (p) => {
        if (p?.imageUrl?.startsWith('/uploads')) return `http://localhost:8080${p.imageUrl}`;
        const imgs = {
            'Smartphones': '/images/smartphones.jpg',
            'Electronics': '/images/smartphones.jpg',
            'Laptops': '/images/laptop.jpg',
            'Fashion': '/images/fashion.jpg',
            'Sports': '/images/sports.jpg',
            'Audio': '/images/audio.jpg',
            'Wearables': '/images/wearables.jpg',
        };
        return imgs[p?.category] || '/images/default.jpg';
    };

    if (!token) return <Navigate to="/login" />;
    if (user?.role !== 'ADMIN') return <Navigate to="/home" />;

    const inputStyle = {
        padding: '12px 16px', borderRadius: '10px', border: `2px solid ${c.border}`,
        fontSize: '13px', outline: 'none', fontFamily: "'Inter', sans-serif",
        background: c.input, color: c.text, boxSizing: 'border-box', width: '100%',
        transition: 'all 0.3s'
    };

    return (
        <div style={{ background: c.bg, minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
            
            {/* TOP BAR */}
            <div style={{ background: darkGradient, padding: '10px 30px', color: '#fff', fontSize: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Admin Panel</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span>Welcome, <strong>{user?.username}</strong></span>
                    <button onClick={theme.toggleTheme} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#fff' }}>
                        {theme.isDark ? '☀️' : '🌙'}
                    </button>
                    <Link to="/home" style={{ color: '#fff', textDecoration: 'none', fontSize: '12px', fontWeight: '500' }}>← Back to Site</Link>
                </div>
            </div>

            {/* HEADER */}
            <div style={{ background: c.card, borderBottom: `1px solid ${c.border}`, padding: '14px 30px' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <Link to="/home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: darkGradient, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '13px' }}>E</div>
                            <span style={{ fontWeight: '800', color: c.text, fontSize: '18px' }}>e-shop</span>
                        </Link>
                        <span style={{ color: c.text2 }}>|</span>
                        <span style={{ fontWeight: '600', color: c.primary, fontSize: '14px' }}>Admin Dashboard</span>
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '30px' }}>

                {/* STATS */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
                    {stats.map((s, i) => (
                        <div key={i} style={{ background: c.card, borderRadius: '16px', border: `1px solid ${c.border}`, padding: '22px 25px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>{s.icon}</div>
                            <div>
                                <h3 style={{ fontSize: '26px', fontWeight: '800', color: s.color, marginBottom: '2px' }}>{s.value}</h3>
                                <p style={{ fontSize: '12px', color: c.text2, fontWeight: '500' }}>{s.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* TOOLBAR */}
                <div style={{ background: c.card, borderRadius: '16px', border: `1px solid ${c.border}`, padding: '16px 22px', marginBottom: '20px', display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <div style={{ flex: 1, maxWidth: '400px', position: 'relative' }}>
                        <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
                            style={{ ...inputStyle, paddingLeft: '42px' }} />
                        <span style={{ position: 'absolute', left: '14px', top: '12px', fontSize: '15px' }}>🔍</span>
                    </div>
                    <button onClick={() => setShowForm(!showForm)} style={{
                        padding: '12px 24px', borderRadius: '10px', border: 'none',
                        background: showForm ? '#dc2626' : darkGradient, color: '#fff',
                        fontWeight: '600', fontSize: '13px', cursor: 'pointer',
                        fontFamily: "'Inter', sans-serif", whiteSpace: 'nowrap'
                    }}>{showForm ? '✕ Close' : '+ Add Product'}</button>
                </div>

                {/* ADD FORM */}
                {showForm && (
                    <div style={{ background: c.card, borderRadius: '16px', border: `1px solid ${c.border}`, padding: '28px', marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '17px', fontWeight: '700', color: c.text, marginBottom: '20px' }}>Add New Product</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                            <input placeholder="Product Name *" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={inputStyle} />
                            <input placeholder="Price (₹) *" type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={inputStyle} />
                            <input placeholder="Stock Qty *" type="number" value={formData.stockQuantity} onChange={e => setFormData({...formData, stockQuantity: e.target.value})} style={inputStyle} />
                            <input placeholder="Category *" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={inputStyle} />
                            <input placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={inputStyle} />
                            <input placeholder="Image URL (optional)" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} style={inputStyle} />
                            <div>
                                <label style={{ fontSize: '11px', fontWeight: '600', color: c.text2, marginBottom: '4px', display: 'block' }}>Upload Image</label>
                                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} style={{ fontSize: '12px', fontFamily: "'Inter', sans-serif" }} />
                            </div>
                        </div>
                        <button onClick={handleAdd} style={{ marginTop: '18px', padding: '12px 32px', background: darkGradient, color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>Save Product</button>
                    </div>
                )}

                {/* PRODUCTS TABLE - SCROLLABLE */}
                <div style={{ background: c.card, borderRadius: '16px', border: `1px solid ${c.border}`, overflow: 'hidden' }}>
                    <div style={{ padding: '18px 24px', borderBottom: `1px solid ${c.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: '700', color: c.text, fontSize: '15px' }}>All Products</span>
                        <span style={{ color: c.text2, fontSize: '12px', background: c.bg2, padding: '4px 12px', borderRadius: '8px', fontWeight: '600' }}>{filtered.length} items</span>
                    </div>
                    <div style={{ maxHeight: '600px', overflowY: 'auto', overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
                            <thead>
                                <tr style={{ background: c.bg2, borderBottom: `2px solid ${c.border}`, position: 'sticky', top: 0, zIndex: 1 }}>
                                    <th style={thStyle}>ID</th>
                                    <th style={thStyle}>Product</th>
                                    <th style={thStyle}>Category</th>
                                    <th style={thStyle}>Price</th>
                                    <th style={thStyle}>Stock</th>
                                    <th style={thStyle}>Status</th>
                                    <th style={{...thStyle, textAlign: 'center'}}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(p => (
                                    <tr key={p.id} style={{ borderBottom: `1px solid ${c.border}`, transition: 'background 0.2s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = c.hover}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        <td style={tdStyle}>#{p.id}</td>
                                        <td style={tdStyle}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: '44px', height: '44px', borderRadius: '10px', overflow: 'hidden', background: c.bg2, flexShrink: 0 }}>
                                                    <img src={getImage(p)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>
                                                <div>
                                                    <p style={{ fontWeight: '600', color: c.text, fontSize: '14px', marginBottom: '2px' }}>{p.name}</p>
                                                    <p style={{ color: c.text2, fontSize: '11px', maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.description?.substring(0, 40)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            <span style={{ padding: '4px 12px', background: c.bg2, color: c.primary, borderRadius: '8px', fontSize: '11px', fontWeight: '700' }}>{p.category}</span>
                                        </td>
                                        <td style={{...tdStyle, fontWeight: '700', color: c.text, fontSize: '14px'}}>₹{Number(p.price).toLocaleString()}</td>
                                        <td style={{...tdStyle, fontWeight: '600', color: p.stockQuantity > 10 ? '#059669' : p.stockQuantity > 0 ? '#d97706' : '#dc2626'}}>{p.stockQuantity}</td>
                                        <td style={tdStyle}>
                                            <span style={{ padding: '4px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', background: p.stockQuantity > 0 ? 'rgba(5,150,105,0.1)' : 'rgba(220,38,38,0.1)', color: p.stockQuantity > 0 ? '#059669' : '#dc2626' }}>
                                                {p.stockQuantity > 0 ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td style={{...tdStyle, textAlign: 'center'}}>
                                            <button onClick={() => setEditingProduct(p)} style={{ padding: '6px 14px', background: c.bg2, color: c.primary, border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '12px', cursor: 'pointer', marginRight: '6px', fontFamily: "'Inter', sans-serif" }}>Edit</button>
                                            <button onClick={() => handleDelete(p.id)} style={{ padding: '6px 14px', background: 'rgba(220,38,38,0.1)', color: '#dc2626', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '12px', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr><td colSpan="7" style={{ textAlign: 'center', padding: '60px', color: c.text2 }}>
                                        <p style={{ fontSize: '40px', marginBottom: '10px' }}>📦</p>
                                        <p style={{ fontWeight: '600', fontSize: '15px' }}>No products found</p>
                                    </td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* EDIT MODAL */}
            {editingProduct && (
                <div onClick={() => setEditingProduct(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                    <div onClick={e => e.stopPropagation()} style={{ background: c.card, borderRadius: '20px', padding: '32px', width: '520px', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 25px 80px rgba(0,0,0,0.2)', border: `1px solid ${c.border}` }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: c.text, marginBottom: '22px' }}>Edit Product #{editingProduct.id}</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {[
                                ['Name', 'name', 'text'],
                                ['Price', 'price', 'number'],
                                ['Stock', 'stockQuantity', 'number'],
                                ['Category', 'category', 'text'],
                            ].map(f => (
                                <div key={f[1]}>
                                    <label style={{ fontSize: '12px', fontWeight: '600', color: c.primary, display: 'block', marginBottom: '5px', textTransform: 'uppercase' }}>{f[0]}</label>
                                    <input type={f[2]} value={editingProduct[f[1]]} onChange={e => setEditingProduct({...editingProduct, [f[1]]: e.target.value})} style={inputStyle} />
                                </div>
                            ))}
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: '600', color: c.primary, display: 'block', marginBottom: '5px', textTransform: 'uppercase' }}>Description</label>
                                <textarea value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} style={{...inputStyle, height: '70px', resize: 'vertical'}} />
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button onClick={handleUpdate} style={{ flex: 1, padding: '12px', background: darkGradient, color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>Save Changes</button>
                                <button onClick={() => setEditingProduct(null)} style={{ flex: 1, padding: '12px', background: c.bg2, color: c.text, border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const thStyle = { padding: '14px 18px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' };
const tdStyle = { padding: '14px 18px', fontSize: '13px', color: '#333', verticalAlign: 'middle' };

export default AdminPanel;