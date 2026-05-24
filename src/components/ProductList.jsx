import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getToken } from '../services/api';
import { Navigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);	
	const theme = useTheme();
	const c = theme.colors;

    useEffect(() => {
        loadProducts();
    }, []);

    useEffect(() => {
        if (search.trim() === '') {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter(p => 
                p.name?.toLowerCase().includes(search.toLowerCase()) ||
                p.category?.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredProducts(filtered);
        }
    }, [search, products]);

    const loadProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
            setFilteredProducts(data);
        } catch (error) {
            console.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    if (!getToken()) return <Navigate to="/login" />;

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <div style={styles.header}>
                    <h1 style={styles.heading}>Our Collection</h1>
                    <p style={styles.subtitle}>{filteredProducts.length} Products Found</p>
                    
                    <div style={styles.searchBox}>
                        <input type="text" placeholder="🔍 Search products..." 
                            value={search} onChange={(e) => setSearch(e.target.value)}
                            style={styles.searchInput} />
                    </div>
                </div>

                {loading ? (
                    <div style={styles.loading}>
                        <h2 style={{ color: '#7c5cbf' }}>Loading products...</h2>
                    </div>
                ) : (
                    <div style={styles.grid}>
                        {filteredProducts.map(product => (
                            <Link to={`/product/${product.id}`} key={product.id} style={{ textDecoration: 'none' }}>
                                <div style={styles.card}>
                                    <div style={styles.imageBox}>
                                        <span style={styles.emoji}>
                                            {product.category === 'Electronics' ? '📱' : 
                                             product.category === 'Sports' ? '👟' : 
                                             product.category === 'Fashion' ? '👗' : '📦'}
                                        </span>
                                        {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
                                            <span style={styles.badge}>Few Left</span>
                                        )}
                                        {product.stockQuantity === 0 && (
                                            <span style={styles.outBadge}>Sold Out</span>
                                        )}
                                    </div>
                                    <div style={styles.cardBody}>
                                        <span style={styles.category}>{product.category}</span>
                                        <h3 style={styles.productName}>{product.name}</h3>
                                        <p style={styles.description}>{product.description?.substring(0, 50)}...</p>
                                        <div style={styles.footer}>
                                            <span style={styles.price}>₹{Number(product.price).toLocaleString()}</span>
                                            <span style={styles.viewBtn}>View →</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                        {filteredProducts.length === 0 && (
                            <div style={styles.empty}>
                                <span style={{ fontSize: '80px' }}>🔍</span>
                                <h3>No products found</h3>
                                <p>Try a different search term</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        padding: '40px 20px'
    },
    container: { maxWidth: '1200px', margin: '0 auto' },
    header: { textAlign: 'center', marginBottom: '40px' },
    heading: { fontSize: '36px', fontWeight: '900', color: '#2d3436', marginBottom: '5px' },
    subtitle: { color: '#636e72', fontSize: '16px', marginBottom: '20px' },
    searchBox: { maxWidth: '400px', margin: '0 auto' },
    searchInput: {
        width: '100%', padding: '14px 20px', fontSize: '16px',
        borderRadius: '30px', border: '1px solid #ddd', outline: 'none',
        boxShadow: '0 5px 20px rgba(0,0,0,0.1)', boxSizing: 'border-box',
        textAlign: 'center'
    },
    loading: { textAlign: 'center', padding: '100px' },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '25px'
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
        transition: 'transform 0.3s',
        cursor: 'pointer'
    },
    imageBox: {
        height: '180px',
        background: 'linear-gradient(135deg, #667eea22 0%, #764ba222 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative'
    },
    emoji: { fontSize: '60px' },
    badge: {
        position: 'absolute', top: '10px', right: '10px',
        backgroundColor: '#fdcb6e', color: '#333', padding: '4px 12px',
        borderRadius: '12px', fontSize: '11px', fontWeight: '700'
    },
    outBadge: {
        position: 'absolute', top: '10px', right: '10px',
        backgroundColor: '#ff7675', color: 'white', padding: '4px 12px',
        borderRadius: '12px', fontSize: '11px', fontWeight: '700'
    },
    cardBody: { padding: '20px' },
    category: {
        display: 'inline-block', padding: '4px 12px',
        backgroundColor: '#667eea15', color: '#667eea',
        borderRadius: '12px', fontSize: '11px', fontWeight: '700', marginBottom: '10px'
    },
    productName: { fontSize: '18px', fontWeight: '700', color: '#2d3436', marginBottom: '8px' },
    description: { color: '#888', fontSize: '13px', marginBottom: '15px' },
    footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    price: { fontSize: '22px', fontWeight: '800', color: '#667eea' },
    viewBtn: { color: '#667eea', fontWeight: '700', fontSize: '13px' },
    empty: { textAlign: 'center', padding: '80px', gridColumn: '1/-1', color: '#636e72' }
};

export default ProductList;