import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { getProducts, getToken, getCurrentUser, logoutUser } from '../services/api';
import axios from 'axios';

const API_URL = 'http://localhost:64002/api';

function AdminPanel() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [activeTab, setActiveTab] = useState('products');
    const token = getToken();
    const user = getCurrentUser();

    const [formData, setFormData] = useState({
        name: '', description: '', price: '', stockQuantity: '', category: '', imageUrl: ''
    });

    useEffect(() => { loadProducts(); }, []);

    const loadProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (err) { }
    };

    const handleAdd = async () => {
        try {
            await axios.post(`${API_URL}/products`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFormData({ name: '', description: '', price: '', stockQuantity: '', category: '', imageUrl: '' });
            setShowForm(false);
            loadProducts();
        } catch (err) { alert('Failed to add product'); }
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`${API_URL}/products/${editingProduct.id}`, editingProduct, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEditingProduct(null);
            loadProducts();
        } catch (err) { alert('Failed to update'); }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this product?')) {
            try {
                await axios.delete(`${API_URL}/products/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                loadProducts();
            } catch (err) { alert('Failed to delete'); }
        }
    };

    const filtered = products.filter(p =>
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.toLowerCase().includes(search.toLowerCase())
    );

    const stats = [
        { label: 'Total Products', value: products.length, color: '#2874f0', bg: '#E3F0FF' },
        { label: 'In Stock', value: products.filter(p => p.stockQuantity > 0).length, color: '#388e3c', bg: '#E8F5E9' },
        { label: 'Low Stock', value: products.filter(p => p.stockQuantity > 0 && p.stockQuantity <= 5).length, color: '#ff9f00', bg: '#FFF8E1' },
        { label: 'Out of Stock', value: products.filter(p => p.stockQuantity === 0).length, color: '#e74c3c', bg: '#FFF3F3' },
    ];

    if (!token) return <Navigate to="/login" />;
    if (user?.role !== 'ADMIN') return <Navigate to="/home" />;

    return (
        <div style={{ background: '#f1f2f4', minHeight: '100vh', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>

            {/* TOP BAR */}
            <div style={{ background: '#ffffff', borderBottom: '1px solid #f0f0f0', padding: '8px 0', fontSize: '12px', color: '#666' }}>
                <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 30px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Admin Panel</span>
                    <span>Welcome, <strong>{user?.username}</strong></span>
                </div>
            </div>

            {/* HEADER */}
            <div style={{ background: '#2874f0', padding: '0 30px' }}>
                <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                        <Link to="/home" style={{ textDecoration: 'none', color: 'white', fontWeight: '700', fontSize: '20px', letterSpacing: '-0.5px' }}>e-shop</Link>
                        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>|</span>
                        <span style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>Admin Dashboard</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <Link to="/home" style={{ color: 'white', textDecoration: 'none', fontSize: '13px', fontWeight: '500' }}>← Back to Site</Link>
                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700' }}>
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '25px 30px' }}>

                {/* STATS */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '25px' }}>
                    {stats.map((s, i) => (
                        <div key={i} style={{ background: '#ffffff', padding: '25px', borderRadius: '4px', border: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '18px' }}>
                            <div style={{ width: '55px', height: '55px', borderRadius: '4px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', color: s.color, fontWeight: '700' }}>
                                {s.value}
                            </div>
                            <div>
                                <p style={{ fontSize: '12px', color: '#878787', margin: '0 0 3px', fontWeight: '500' }}>{s.label}</p>
                                <span style={{ fontSize: '22px', fontWeight: '800', color: '#212121' }}>{s.value}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* TOOLBAR */}
                <div style={{ background: '#ffffff', borderRadius: '4px', border: '1px solid #f0f0f0', padding: '15px 20px', marginBottom: '15px', display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <div style={{ flex: 1, position: 'relative', maxWidth: '400px' }}>
                        <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
                            style={{ width: '100%', padding: '10px 16px', borderRadius: '2px', border: '1px solid #e0e0e0', fontSize: '13px', outline: 'none', fontFamily: "'Inter', sans-serif", boxSizing: 'border-box' }} />
                    </div>
                    <button onClick={() => setShowForm(!showForm)}
                        style={{ padding: '10px 22px', background: showForm ? '#e74c3c' : '#2874f0', color: 'white', border: 'none', borderRadius: '2px', fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: "'Inter', sans-serif", whiteSpace: 'nowrap' }}>
                        {showForm ? '✕ Close Form' : '+ Add Product'}
                    </button>
                </div>

                {/* ADD FORM */}
                {showForm && (
                    <div style={{ background: '#ffffff', borderRadius: '4px', border: '1px solid #f0f0f0', padding: '25px', marginBottom: '15px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#212121', marginBottom: '18px' }}>Add New Product</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                            <input placeholder="Product Name *" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={formInputStyle} />
                            <input placeholder="Price (₹) *" type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} style={formInputStyle} />
                            <input placeholder="Stock Quantity *" type="number" value={formData.stockQuantity} onChange={e => setFormData({ ...formData, stockQuantity: e.target.value })} style={formInputStyle} />
                            <input placeholder="Category *" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} style={formInputStyle} />
                            <input placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={formInputStyle} />
                            <input placeholder="Image URL (optional)" value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} style={formInputStyle} />
                        </div>
                        <button onClick={handleAdd} style={{ marginTop: '15px', padding: '10px 30px', background: '#2874f0', color: 'white', border: 'none', borderRadius: '2px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>
                            Save Product
                        </button>
                    </div>
                )}

                {/* PRODUCTS TABLE */}
                <div style={{ background: '#ffffff', borderRadius: '4px', border: '1px solid #f0f0f0', overflow: 'hidden' }}>
                    <div style={{ padding: '15px 20px', borderBottom: '1px solid #f0f0f0' }}>
                        <span style={{ fontWeight: '700', color: '#212121', fontSize: '15px' }}>All Products</span>
                        <span style={{ color: '#878787', fontSize: '12px', marginLeft: '10px' }}>{filtered.length} items</span>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
                            <thead>
                                <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #e0e0e0' }}>
                                    <th style={thStyle}>ID</th>
                                    <th style={thStyle}>Product</th>
                                    <th style={thStyle}>Category</th>
                                    <th style={thStyle}>Price</th>
                                    <th style={thStyle}>Stock</th>
                                    <th style={thStyle}>Status</th>
                                    <th style={{ ...thStyle, textAlign: 'center' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(p => (
                                    <tr key={p.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                        <td style={tdStyle}>#{p.id}</td>
                                        <td style={tdStyle}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: '45px', height: '45px', borderRadius: '4px', background: '#f5f5f5', overflow: 'hidden', flexShrink: 0 }}>
                                                    <img src={getCategoryImage(p.category)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>
                                                <div>
                                                    <p style={{ fontWeight: '600', color: '#212121', fontSize: '14px', margin: '0 0 2px' }}>{p.name}</p>
                                                    <p style={{ color: '#878787', fontSize: '11px', margin: 0 }}>{p.description?.substring(0, 45)}...</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            <span style={{ padding: '3px 10px', background: '#E3F0FF', color: '#2874f0', borderRadius: '2px', fontSize: '12px', fontWeight: '600' }}>{p.category}</span>
                                        </td>
                                        <td style={{ ...tdStyle, fontWeight: '700', color: '#212121' }}>₹{Number(p.price).toLocaleString()}</td>
                                        <td style={{ ...tdStyle, fontWeight: '600', color: p.stockQuantity > 10 ? '#388e3c' : p.stockQuantity > 0 ? '#ff9f00' : '#e74c3c' }}>
                                            {p.stockQuantity}
                                        </td>
                                        <td style={tdStyle}>
                                            <span style={{
                                                padding: '3px 10px', borderRadius: '2px', fontSize: '11px', fontWeight: '700',
                                                background: p.stockQuantity > 0 ? '#E8F5E9' : '#FFF3F3',
                                                color: p.stockQuantity > 0 ? '#388e3c' : '#e74c3c'
                                            }}>
                                                {p.stockQuantity > 0 ? 'ACTIVE' : 'INACTIVE'}
                                            </span>
                                        </td>
                                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                                            <button onClick={() => setEditingProduct(p)}
                                                style={{ padding: '6px 14px', background: '#E3F0FF', color: '#2874f0', border: 'none', borderRadius: '2px', fontWeight: '600', fontSize: '12px', cursor: 'pointer', marginRight: '8px', fontFamily: "'Inter', sans-serif" }}>
                                                Edit
                                            </button>
                                            <button onClick={() => handleDelete(p.id)}
                                                style={{ padding: '6px 14px', background: '#FFF3F3', color: '#e74c3c', border: 'none', borderRadius: '2px', fontWeight: '600', fontSize: '12px', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '50px', color: '#878787' }}>
                                            <p style={{ fontSize: '40px', margin: '0 0 10px' }}>📦</p>
                                            <p style={{ fontSize: '15px', fontWeight: '600' }}>No products found</p>
                                            <p style={{ fontSize: '13px' }}>Add your first product or adjust your search</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* EDIT MODAL */}
            {editingProduct && (
                <div onClick={() => setEditingProduct(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div onClick={e => e.stopPropagation()} style={{ background: '#ffffff', borderRadius: '4px', padding: '30px', width: '500px', maxHeight: '80vh', overflowY: 'auto' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#212121', marginBottom: '20px' }}>Edit Product #{editingProduct.id}</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <label style={labelStyle}>Name</label>
                            <input value={editingProduct.name} onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })} style={formInputStyle} />

                            <label style={labelStyle}>Price</label>
                            <input type="number" value={editingProduct.price} onChange={e => setEditingProduct({ ...editingProduct, price: e.target.value })} style={formInputStyle} />

                            <label style={labelStyle}>Stock</label>
                            <input type="number" value={editingProduct.stockQuantity} onChange={e => setEditingProduct({ ...editingProduct, stockQuantity: e.target.value })} style={formInputStyle} />

                            <label style={labelStyle}>Category</label>
                            <input value={editingProduct.category} onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })} style={formInputStyle} />

                            <label style={labelStyle}>Description</label>
                            <textarea value={editingProduct.description} onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })} style={{ ...formInputStyle, height: '80px', resize: 'vertical' }} />

                            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                                <button onClick={handleUpdate} style={{ flex: 1, padding: '10px', background: '#2874f0', color: 'white', border: 'none', borderRadius: '2px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>Save Changes</button>
                                <button onClick={() => setEditingProduct(null)} style={{ flex: 1, padding: '10px', background: '#f5f5f5', color: '#666', border: 'none', borderRadius: '2px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const getCategoryImage = (category) => {
    const images = {
        'Smartphones': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&q=80',
        'Electronics': 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=100&q=80',
        'Headphones': 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=100&q=80',
        'Laptops': 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=100&q=80',
        'Fashion': 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=100&q=80',
        'Sports': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&q=80',
        'Beauty': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&q=80',
        'Home': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&q=80',
        'Books': 'https://images.unsplash.com/photo-1526243741027-444d633d7365?w=100&q=80',
        'Cameras': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100&q=80',
        'Smartwatches': 'https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=100&q=80',
        'Accessories': 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=100&q=80',
        'Gaming': 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=100&q=80',
    };
    return images[category] || 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=100&q=80';
};

const thStyle = {
    padding: '14px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '700',
    color: '#878787', textTransform: 'uppercase', letterSpacing: '0.5px'
};
const tdStyle = {
    padding: '14px 16px', fontSize: '13px', color: '#333', verticalAlign: 'middle'
};
const formInputStyle = {
    padding: '10px 14px', borderRadius: '2px', border: '1px solid #e0e0e0',
    fontSize: '13px', outline: 'none', fontFamily: "'Inter', sans-serif",
    boxSizing: 'border-box', width: '100%'
};
const labelStyle = {
    fontSize: '12px', fontWeight: '600', color: '#555'
};

export default AdminPanel;