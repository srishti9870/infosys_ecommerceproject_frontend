import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById, getToken, getCurrentUser } from '../services/api';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);
    const user = getCurrentUser();
    const token = getToken();

    useEffect(() => {
        loadProduct();
        window.scrollTo(0, 0);
    }, [id]);

    const loadProduct = async () => {
        try {
            const data = await getProductById(id);
            setProduct(data);
        } catch (err) {
            console.error('Failed to load product');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            await axios.post(`${API_URL}/cart`, {
                userId: user.userId,
                product: { id: product.id },
                quantity: quantity
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 2500);
        } catch (err) {
            alert('Failed to add to cart');
        }
    };

    const getCategoryImage = (category) => {
        const images = {
            'Smartphones': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
            'Electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80',
            'Headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
            'Laptops': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80',
            'Fashion': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80',
            'Sports': 'https://images.unsplash.com/photo-1461896836934-bd45ba4fcf69?w=600&q=80',
            'Beauty': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc8?w=600&q=80',
            'Home': 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600&q=80',
        };
        return images[category] || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&q=80';
    };

    if (!token) return <Navigate to="/login" />;
    if (loading) return <div style={{ textAlign: 'center', padding: '80px', color: '#878787', fontFamily: "'Inter', sans-serif", fontSize: '18px' }}>Loading product details...</div>;
    if (!product) return <div style={{ textAlign: 'center', padding: '80px', fontFamily: "'Inter', sans-serif" }}><h2>Product not found</h2><Link to="/products" style={{ color: '#2874f0' }}>Back to Products</Link></div>;

    return (
        <div style={{ background: '#f1f2f4', minHeight: '100vh', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
            
            {/* TOP BAR */}
            <div style={{ background: '#2874f0', padding: '12px 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Link to="/home" style={{ color: 'white', textDecoration: 'none', fontSize: '20px', fontWeight: '800', letterSpacing: '-0.5px' }}>e-shop</Link>
				<Link to="/home" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>← Back to Home</Link>
            </div>

            <div style={{ maxWidth: '1100px', margin: '25px auto', padding: '0 20px' }}>
                
                {/* Breadcrumb */}
                <div style={{ fontSize: '12px', color: '#878787', marginBottom: '15px' }}>
                    <Link to="/home" style={{ color: '#878787', textDecoration: 'none' }}>Home</Link>
                    <span style={{ margin: '0 8px' }}>›</span>
                    <Link to="/products" style={{ color: '#878787', textDecoration: 'none' }}>Products</Link>
                    <span style={{ margin: '0 8px' }}>›</span>
                    <span style={{ color: '#212121', fontWeight: '600' }}>{product.name}</span>
                </div>

                {/* PRODUCT DETAIL CARD */}
                <div style={{ background: '#ffffff', borderRadius: '4px', overflow: 'hidden', display: 'flex', gap: '0' }}>
                    
                    {/* LEFT - IMAGE */}
                    <div style={{ width: '45%', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', borderRight: '1px solid #f0f0f0', position: 'relative' }}>
                        <img src={getCategoryImage(product.category)} alt={product.name} 
                            style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', borderRadius: '4px' }} />
                        {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
                            <span style={{ position: 'absolute', top: '20px', left: '20px', background: '#ff9f00', color: 'white', padding: '5px 12px', borderRadius: '2px', fontSize: '12px', fontWeight: '700' }}>
                                Only {product.stockQuantity} left
                            </span>
                        )}
                        {product.stockQuantity === 0 && (
                            <span style={{ position: 'absolute', top: '20px', left: '20px', background: '#e74c3c', color: 'white', padding: '5px 12px', borderRadius: '2px', fontSize: '12px', fontWeight: '700' }}>
                                Sold Out
                            </span>
                        )}
                    </div>

                    {/* RIGHT - DETAILS */}
                    <div style={{ width: '55%', padding: '35px 35px' }}>
                        <span style={{ display: 'inline-block', padding: '4px 10px', background: '#E3F0FF', color: '#2874f0', borderRadius: '2px', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
                            {product.category}
                        </span>
                        
                        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#212121', margin: '0 0 8px', lineHeight: '1.3' }}>
                            {product.name}
                        </h1>
                        
                        <p style={{ fontSize: '14px', color: '#878787', lineHeight: '1.6', marginBottom: '20px' }}>
                            {product.description || 'No description available for this product.'}
                        </p>

                        {/* PRICE */}
                        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                            <span style={{ fontSize: '32px', fontWeight: '800', color: '#212121' }}>
                                ₹{Number(product.price).toLocaleString()}
                            </span>
                            <span style={{ fontSize: '14px', color: '#878787', textDecoration: 'line-through' }}>
                                ₹{Number(product.price * 1.4).toLocaleString()}
                            </span>
                            <span style={{ fontSize: '14px', color: '#388e3c', fontWeight: '700' }}>
                                29% off
                            </span>
                        </div>

                        {/* STOCK STATUS */}
                        <div style={{ display: 'flex', gap: '20px', marginBottom: '25px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: product.stockQuantity > 0 ? '#388e3c' : '#e74c3c' }}>
                                {product.stockQuantity > 0 ? '✓ In Stock' : '✗ Out of Stock'}
                            </span>
                            <span style={{ fontSize: '13px', color: '#878787' }}>
                                Quantity: {product.stockQuantity} available
                            </span>
                        </div>

                        {/* DIVIDER */}
                        <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '20px', marginBottom: '20px' }}></div>

                        {/* QUANTITY SELECTOR */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#212121' }}>Quantity:</span>
                            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e0e0e0', borderRadius: '2px' }}>
                                <button onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                                    style={{ width: '36px', height: '36px', border: 'none', background: '#f5f5f5', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                                <span style={{ width: '50px', textAlign: 'center', fontWeight: '700', fontSize: '14px' }}>{quantity}</span>
                                <button onClick={() => quantity < product.stockQuantity && setQuantity(quantity + 1)}
                                    style={{ width: '36px', height: '36px', border: 'none', background: '#f5f5f5', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                            </div>
                        </div>

                        {/* BUTTONS */}
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                            <button onClick={handleAddToCart}
                                disabled={product.stockQuantity === 0}
                                style={{
                                    flex: 1, padding: '16px', fontSize: '16px', fontWeight: '700', borderRadius: '2px',
                                    border: 'none', cursor: product.stockQuantity > 0 ? 'pointer' : 'not-allowed',
                                    background: addedToCart ? '#388e3c' : '#ff9f00', color: 'white',
                                    transition: 'all 0.3s', fontFamily: "'Inter', sans-serif"
                                }}
                                onMouseEnter={e => { if(product.stockQuantity > 0) e.target.style.opacity = '0.9' }}
                                onMouseLeave={e => { if(product.stockQuantity > 0) e.target.style.opacity = '1' }}
                            >
                                {addedToCart ? '✓ Added to Cart!' : '🛒 Add to Cart'}
                            </button>
                            
                            <button disabled={product.stockQuantity === 0}
                                style={{
                                    flex: 1, padding: '16px', fontSize: '16px', fontWeight: '700', borderRadius: '2px',
                                    border: 'none', cursor: product.stockQuantity > 0 ? 'pointer' : 'not-allowed',
                                    background: product.stockQuantity > 0 ? '#2874f0' : '#ccc', color: 'white',
                                    fontFamily: "'Inter', sans-serif"
                                }}>
                                ⚡ Buy Now
                            </button>
                        </div>

                        {/* PRODUCT DETAILS TABLE */}
                        <div style={{ background: '#fafafa', padding: '20px', borderRadius: '4px' }}>
                            <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#212121', marginBottom: '15px' }}>Product Details</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px' }}>
                                <div>
                                    <span style={{ color: '#878787' }}>Category:</span>
                                    <span style={{ marginLeft: '8px', color: '#212121', fontWeight: '600' }}>{product.category}</span>
                                </div>
                                <div>
                                    <span style={{ color: '#878787' }}>Availability:</span>
                                    <span style={{ marginLeft: '8px', color: product.stockQuantity > 0 ? '#388e3c' : '#e74c3c', fontWeight: '600' }}>
                                        {product.stockQuantity} units
                                    </span>
                                </div>
                                <div>
                                    <span style={{ color: '#878787' }}>Product ID:</span>
                                    <span style={{ marginLeft: '8px', color: '#212121', fontWeight: '600' }}>#{product.id}</span>
                                </div>
                                <div>
                                    <span style={{ color: '#878787' }}>Added On:</span>
                                    <span style={{ marginLeft: '8px', color: '#212121', fontWeight: '600' }}>
                                        {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;