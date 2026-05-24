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
    const [loading, setLoading] = useState(true);
    const [imageFile, setImageFile] = useState(null);
    const [activeTab, setActiveTab] = useState('products');
    const token = getToken();
    const user = getCurrentUser();
	const theme = useTheme();
	const c = theme.colors;

    const [formData, setFormData] = useState({
        name: '', description: '', price: '', stockQuantity: '', category: '', imageUrl: ''
    });

    useEffect(() => { loadProducts(); }, []);

    const loadProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(Array.isArray(data) ? data : data?.products || []);
        } catch (err) {} finally { setLoading(false); }
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
        { label: 'Total Products', value: products.length, color: '#4c1d95', bg: '#f5f0ff', icon: '📦' },
        { label: 'In Stock', value: products.filter(p => p.stockQuantity > 0).length, color: '#059669', bg: '#ecfdf5', icon: '✓' },
        { label: 'Low Stock', value: products.filter(p => p.stockQuantity > 0 && p.stockQuantity <= 5).length, color: '#d97706', bg: '#fffbeb', icon: '⚠' },
        { label: 'Out of Stock', value: products.filter(p => p.stockQuantity === 0).length, color: '#dc2626', bg: '#fef2f2', icon: '✕' },
    ];

    const getImage = (p) => {
        if (p?.imageUrl?.startsWith('/uploads')) return `http://localhost:8080${p.imageUrl}`;
        const imgs = {
            'Smartphones': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=80&q=80',
            'Electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=80&q=80',
            'Laptops': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=80&q=80',
            'Fashion': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=80&q=80',
            'Sports': 'https://images.unsplash.com/photo-1461896836934-bd45ba4fcf69?w=80&q=80',
            'Beauty': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc8?w=80&q=80',
            'Home': 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=80&q=80',
        };
        return imgs[p?.category] || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=80&q=80';
    };

    if (!token) return <Navigate to="/login" />;
    if (user?.role !== 'ADMIN') return <Navigate to="/home" />;

    const inputStyle = {
        padding: '12px 16px', borderRadius: '10px', border: '2px solid #e9d5ff',
        fontSize: '13px', outline: 'none', fontFamily: "'Inter', sans-serif",
        background: '#faf8ff', color: '#1a0a2e', boxSizing: 'border-box', width: '100%',
        transition: 'all 0.3s'
    };

    return (
        <div style={{ background: '#faf8ff', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
            
            {/* TOP BAR */}
            <div style={{ background: '#1a0a2e', padding: '10px 30px', color: '#e9d5ff', fontSize: '12px', display: 'flex', justifyContent: 'space-between' }}>
                <span>Admin Panel</span>
                <span>Welcome, <strong style={{ color: '#fff' }}>{user?.username}</strong></span>
            </div>

            {/* HEADER */}
            <div style={{ background: '#fff', borderBottom: '1px solid #e9d5ff', padding: '14px 30px' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <Link to="/home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '13px' }}>E</div>
                            <span style={{ fontWeight: '800', color: '#1a0a2e', fontSize: '18px' }}>e-shop</span>
                        </Link>
                        <span style={{ color: '#6b7280' }}>|</span>
                        <span style={{ fontWeight: '600', color: '#4c1d95', fontSize: '14px' }}>Admin Dashboard</span>
                    </div>
                    <Link to="/home" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '13px', fontWeight: '500' }}>← Back to Site</Link>
                </div>
            </div>

            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '30px' }}>

                {/* STATS */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
                    {stats.map((s, i) => (
                        <div key={i} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e9d5ff', padding: '22px 25px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 4px 20px rgba(76,29,149,0.03)' }}>
                            <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>{s.icon}</div>
                            <div>
                                <h3 style={{ fontSize: '26px', fontWeight: '800', color: s.color, marginBottom: '2px' }}>{s.value}</h3>
                                <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>{s.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* TOOLBAR */}
                <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e9d5ff', padding: '16px 22px', marginBottom: '20px', display: 'flex', gap: '15px', alignItems: 'center', boxShadow: '0 4px 20px rgba(76,29,149,0.03)' }}>
                    <div style={{ flex: 1, maxWidth: '400px', position: 'relative' }}>
                        <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
                            style={{ ...inputStyle, paddingLeft: '42px' }} />
                        <span style={{ position: 'absolute', left: '14px', top: '12px', fontSize: '15px' }}>🔍</span>
                    </div>
                    <button onClick={() => setShowForm(!showForm)} style={{
                        padding: '12px 24px', borderRadius: '10px', border: 'none',
                        background: showForm ? '#dc2626' : 'linear-gradient(135deg, #4c1d95, #7c3aed)',
                        color: '#fff', fontWeight: '600', fontSize: '13px', cursor: 'pointer',
                        fontFamily: "'Inter', sans-serif", whiteSpace: 'nowrap', transition: 'all 0.3s',
                        boxShadow: showForm ? 'none' : '0 4px 15px rgba(76,29,149,0.2)'
                    }}>{showForm ? '✕ Close Form' : '+ Add Product'}</button>
                </div>

                {/* ADD FORM */}
                {showForm && (
                    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e9d5ff', padding: '28px', marginBottom: '20px', boxShadow: '0 4px 20px rgba(76,29,149,0.04)' }}>
                        <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#1a0a2e', marginBottom: '20px' }}>Add New Product</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                            <input placeholder="Product Name *" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={inputStyle} />
                            <input placeholder="Price (₹) *" type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={inputStyle} />
                            <input placeholder="Stock Qty *" type="number" value={formData.stockQuantity} onChange={e => setFormData({...formData, stockQuantity: e.target.value})} style={inputStyle} />
                            <input placeholder="Category *" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={inputStyle} />
                            <input placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={inputStyle} />
                            <input placeholder="Image URL (optional)" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} style={inputStyle} />
                            <div>
                                <label style={{ fontSize: '11px', fontWeight: '600', color: '#6b7280', marginBottom: '4px', display: 'block' }}>Upload Image</label>
                                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} style={{ fontSize: '12px', fontFamily: "'Inter', sans-serif" }} />
                            </div>
                        </div>
                        <button onClick={handleAdd} style={{
                            marginTop: '18px', padding: '12px 32px', background: 'linear-gradient(135deg, #4c1d95, #7c3aed)',
                            color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '14px',
                            cursor: 'pointer', fontFamily: "'Inter', sans-serif", boxShadow: '0 4px 15px rgba(76,29,149,0.2)'
                        }}>Save Product</button>
                    </div>
                )}

                {/* PRODUCTS TABLE */}
                <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e9d5ff', overflow: 'hidden', boxShadow: '0 4px 20px rgba(76,29,149,0.03)' }}>
                    <div style={{ padding: '18px 24px', borderBottom: '1px solid #f5f0ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: '700', color: '#1a0a2e', fontSize: '15px' }}>All Products</span>
                        <span style={{ color: '#6b7280', fontSize: '12px', background: '#f5f0ff', padding: '4px 12px', borderRadius: '8px', fontWeight: '600' }}>{filtered.length} items</span>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
                            <thead>
                                <tr style={{ background: '#faf8ff', borderBottom: '2px solid #e9d5ff' }}>
                                    <th style={th}>ID</th>
                                    <th style={th}>Product</th>
                                    <th style={th}>Category</th>
                                    <th style={th}>Price</th>
                                    <th style={th}>Stock</th>
                                    <th style={th}>Status</th>
                                    <th style={{...th, textAlign: 'center'}}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(p => (
                                    <tr key={p.id} style={{ borderBottom: '1px solid #f5f0ff', transition: 'background 0.2s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#faf8ff'}
                                        onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                                        <td style={td}>#{p.id}</td>
                                        <td style={td}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: '44px', height: '44px', borderRadius: '10px', overflow: 'hidden', background: '#f5f0ff', flexShrink: 0 }}>
                                                    <img src={getImage(p)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>
                                                <div>
                                                    <p style={{ fontWeight: '600', color: '#1a0a2e', fontSize: '14px', marginBottom: '2px' }}>{p.name}</p>
                                                    <p style={{ color: '#6b7280', fontSize: '11px', maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.description?.substring(0, 40)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={td}>
                                            <span style={{ padding: '4px 12px', background: '#f5f0ff', color: '#7c3aed', borderRadius: '8px', fontSize: '11px', fontWeight: '700' }}>{p.category}</span>
                                        </td>
                                        <td style={{...td, fontWeight: '700', color: '#1a0a2e', fontSize: '14px'}}>₹{Number(p.price).toLocaleString()}</td>
                                        <td style={{...td, fontWeight: '600', color: p.stockQuantity > 10 ? '#059669' : p.stockQuantity > 0 ? '#d97706' : '#dc2626'}}>{p.stockQuantity}</td>
                                        <td style={td}>
                                            <span style={{
                                                padding: '4px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '700',
                                                background: p.stockQuantity > 0 ? '#ecfdf5' : '#fef2f2',
                                                color: p.stockQuantity > 0 ? '#059669' : '#dc2626'
                                            }}>{p.stockQuantity > 0 ? 'Active' : 'Inactive'}</span>
                                        </td>
                                        <td style={{...td, textAlign: 'center'}}>
                                            <button onClick={() => setEditingProduct(p)} style={{ padding: '6px 14px', background: '#f5f0ff', color: '#4c1d95', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '12px', cursor: 'pointer', marginRight: '6px', fontFamily: "'Inter', sans-serif" }}>Edit</button>
                                            <button onClick={() => handleDelete(p.id)} style={{ padding: '6px 14px', background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '12px', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr><td colSpan="7" style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
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
                    <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '20px', padding: '32px', width: '520px', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 25px 80px rgba(0,0,0,0.2)' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a0a2e', marginBottom: '22px' }}>Edit Product #{editingProduct.id}</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {[
                                ['Name', 'name', 'text'],
                                ['Price', 'price', 'number'],
                                ['Stock', 'stockQuantity', 'number'],
                                ['Category', 'category', 'text'],
                            ].map(f => (
                                <div key={f[1]}>
                                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#4c1d95', display: 'block', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{f[0]}</label>
                                    <input type={f[2]} value={editingProduct[f[1]]} onChange={e => setEditingProduct({...editingProduct, [f[1]]: e.target.value})} style={inputStyle} />
                                </div>
                            ))}
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: '600', color: '#4c1d95', display: 'block', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Description</label>
                                <textarea value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} style={{...inputStyle, height: '70px', resize: 'vertical'}} />
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button onClick={handleUpdate} style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>Save Changes</button>
                                <button onClick={() => setEditingProduct(null)} style={{ flex: 1, padding: '12px', background: '#f5f0ff', color: '#4c1d95', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const th = { padding: '14px 18px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' };
const td = { padding: '14px 18px', fontSize: '13px', color: '#333', verticalAlign: 'middle' };

export default AdminPanel;