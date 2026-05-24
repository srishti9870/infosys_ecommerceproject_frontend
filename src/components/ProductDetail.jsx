import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById, getToken, getCurrentUser } from '../services/api';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
const API_URL = 'http://localhost:8080/api';

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);
    const [inWishlist, setInWishlist] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [avgRating, setAvgRating] = useState(0);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [activeImage, setActiveImage] = useState(0);
    const [scrolled, setScrolled] = useState(false);
	const theme = useTheme();
	const c = theme.colors;
    const user = getCurrentUser();
    const token = getToken();
	

    const productImages = [
        'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&q=80',
        'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80',
        'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&q=80',
    ];

    useEffect(() => {
        loadProduct();
        window.scrollTo(0, 0);
        window.addEventListener('scroll', () => setScrolled(window.scrollY > 50));
        return () => window.removeEventListener('scroll', () => {});
    }, [id]);

    useEffect(() => {
        if (user && product) {
            checkWishlist();
            loadReviews();
        }
    }, [user, product]);

    const loadProduct = async () => {
        try {
            const data = await getProductById(id);
            setProduct(data);
        } catch (err) {} finally { setLoading(false); }
    };

    const checkWishlist = async () => {
        try {
            const res = await axios.get(`${API_URL}/wishlist/check/${user.userId}/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setInWishlist(res.data);
        } catch (err) {}
    };

    const toggleWishlist = async () => {
        if (!user) { navigate('/login'); return; }
        try {
            if (inWishlist) {
                await axios.delete(`${API_URL}/wishlist/${user.userId}/${product.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setInWishlist(false);
            } else {
                await axios.post(`${API_URL}/wishlist`, {
                    userId: user.userId, product: { id: product.id }
                }, { headers: { Authorization: `Bearer ${token}` } });
                setInWishlist(true);
            }
        } catch (err) {}
    };

    const loadReviews = async () => {
        try {
            const [revRes, avgRes] = await Promise.all([
                axios.get(`${API_URL}/reviews/product/${id}`),
                axios.get(`${API_URL}/reviews/average/${id}`)
            ]);
            setReviews(revRes.data || []);
            setAvgRating(avgRes.data || 0);
        } catch (err) {}
    };

    const submitReview = async () => {
        if (!user) { navigate('/login'); return; }
        if (!newReview.comment.trim()) return;
        try {
            await axios.post(`${API_URL}/reviews`, {
                userId: user.userId, username: user.username,
                product: { id: product.id }, rating: newReview.rating, comment: newReview.comment
            }, { headers: { Authorization: `Bearer ${token}` } });
            setNewReview({ rating: 5, comment: '' });
            loadReviews();
        } catch (err) {}
    };

    const handleAddToCart = async () => {
        if (!user) { navigate('/login'); return; }
        try {
            await axios.post(`${API_URL}/cart`, {
                userId: user.userId, product: { id: product.id }, quantity: quantity
            }, { headers: { Authorization: `Bearer ${token}` } });
            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 2000);
        } catch (err) {}
    };

    if (!token) return <Navigate to="/login" />;
    if (loading) return (
        <div style={{ background: '#faf8ff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ width: '48px', height: '48px', border: '3px solid #e9d5ff', borderTopColor: '#7c3aed', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 20px' }}></div>
                <p style={{ color: '#6b7280' }}>Loading product...</p>
            </div>
        </div>
    );
    if (!product) return (
        <div style={{ textAlign: 'center', padding: '100px', fontFamily: "'Inter', sans-serif", background: '#faf8ff', minHeight: '100vh' }}>
            <h2 style={{ color: '#1a0a2e' }}>Product not found</h2>
            <Link to="/home" style={{ color: '#4c1d95', fontWeight: '600' }}>Back to Home</Link>
        </div>
    );

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
                    <Link to="/home" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '13px', fontWeight: '500' }}>← Back</Link>
                </div>
            </nav>

            <div style={{ maxWidth: '1200px', margin: '90px auto 40px', padding: '0 20px' }}>

                {/* Breadcrumb */}
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '25px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <Link to="/home" style={{ color: '#6b7280', textDecoration: 'none' }}>Home</Link>
                    <span>›</span>
                    <Link to="/home" style={{ color: '#6b7280', textDecoration: 'none' }}>Products</Link>
                    <span>›</span>
                    <span style={{ color: '#4c1d95', fontWeight: '600' }}>{product.name}</span>
                </div>

                {/* MAIN PRODUCT SECTION */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px' }}>
                    
                    {/* LEFT - IMAGES */}
                    <div>
                        <div style={{ borderRadius: '20px', overflow: 'hidden', background: '#fff', border: '1px solid #e9d5ff', marginBottom: '15px', height: '450px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                            <img src={product.imageUrl?.startsWith('/uploads') ? `http://localhost:8080${product.imageUrl}` : productImages[activeImage]} 
                                alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <button onClick={toggleWishlist} style={{
                                position: 'absolute', top: '16px', right: '16px',
                                width: '42px', height: '42px', borderRadius: '50%',
                                background: 'rgba(255,255,255,0.9)', border: 'none',
                                cursor: 'pointer', fontSize: '22px', display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                                backdropFilter: 'blur(10px)', boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                transition: 'all 0.3s'
                            }}>{inWishlist ? '❤️' : '🤍'}</button>
                            {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
                                <span style={{ position: 'absolute', top: '16px', left: '16px', padding: '6px 14px', background: '#ff9f00', color: '#fff', borderRadius: '8px', fontSize: '12px', fontWeight: '700' }}>Only {product.stockQuantity} left</span>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {productImages.map((img, i) => (
                                <div key={i} onClick={() => setActiveImage(i)} style={{
                                    width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden',
                                    cursor: 'pointer', border: i === activeImage ? '3px solid #7c3aed' : '2px solid #e9d5ff',
                                    transition: 'all 0.3s', opacity: i === activeImage ? 1 : 0.7
                                }}>
                                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT - DETAILS */}
                    <div>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '1.5px', background: '#f5f0ff', padding: '5px 14px', borderRadius: '8px' }}>{product.category}</span>
                        
                        <h1 style={{ fontSize: '30px', fontWeight: '800', color: '#1a0a2e', margin: '15px 0 10px', lineHeight: '1.2' }}>{product.name}</h1>
                        
                        {/* Rating */}
                        {avgRating > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                                <span style={{ color: '#ff9f00', fontSize: '15px' }}>{'⭐'.repeat(Math.round(avgRating))}</span>
                                <span style={{ color: '#6b7280', fontSize: '13px', fontWeight: '600' }}>{avgRating}/5 ({reviews.length} reviews)</span>
                            </div>
                        )}

                        <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: '1.7', marginBottom: '25px' }}>{product.description || 'No description available for this product.'}</p>

                        {/* Price */}
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '20px', background: '#faf8ff', padding: '20px', borderRadius: '14px', border: '1px solid #e9d5ff' }}>
                            <span style={{ fontSize: '36px', fontWeight: '800', color: '#4c1d95' }}>₹{Number(product.price).toLocaleString()}</span>
                            <span style={{ fontSize: '16px', color: '#6b7280', textDecoration: 'line-through' }}>₹{Number(product.price * 1.4).toLocaleString()}</span>
                            <span style={{ fontSize: '14px', color: '#059669', fontWeight: '700' }}>29% off</span>
                        </div>

                        {/* Stock */}
                        <div style={{ display: 'flex', gap: '25px', marginBottom: '25px', fontSize: '13px' }}>
                            <span style={{ fontWeight: '600', color: product.stockQuantity > 0 ? '#059669' : '#dc2626' }}>{product.stockQuantity > 0 ? '✓ In Stock' : '✗ Out of Stock'}</span>
                            <span style={{ color: '#6b7280' }}>{product.stockQuantity} units available</span>
                        </div>

                        {/* Quantity */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#1a0a2e' }}>Quantity:</span>
                            <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #e9d5ff', borderRadius: '10px', overflow: 'hidden' }}>
                                <button onClick={() => quantity > 1 && setQuantity(quantity - 1)} style={{ width: '38px', height: '38px', border: 'none', background: '#faf8ff', cursor: 'pointer', fontSize: '18px', color: '#4c1d95', fontWeight: '600' }}>−</button>
                                <span style={{ width: '50px', textAlign: 'center', fontWeight: '700', fontSize: '15px', color: '#1a0a2e' }}>{quantity}</span>
                                <button onClick={() => quantity < product.stockQuantity && setQuantity(quantity + 1)} style={{ width: '38px', height: '38px', border: 'none', background: '#faf8ff', cursor: 'pointer', fontSize: '18px', color: '#4c1d95', fontWeight: '600' }}>+</button>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '25px' }}>
                            <button onClick={handleAddToCart} disabled={product.stockQuantity === 0} style={{
                                flex: 1, padding: '16px', fontSize: '16px', fontWeight: '700', borderRadius: '12px', border: 'none',
                                cursor: product.stockQuantity > 0 ? 'pointer' : 'not-allowed',
                                background: addedToCart ? '#059669' : 'linear-gradient(135deg, #4c1d95, #7c3aed)',
                                color: '#fff', fontFamily: "'Inter', sans-serif",
                                boxShadow: '0 8px 25px rgba(76,29,149,0.2)', transition: 'all 0.3s'
                            }}
                                onMouseEnter={e => { if(product.stockQuantity) e.target.style.transform = 'translateY(-2px)'; }}
                                onMouseLeave={e => { if(product.stockQuantity) e.target.style.transform = 'translateY(0)'; }}
                            >{addedToCart ? '✓ Added to Cart!' : 'Add to Cart'}</button>
                            
                            <button disabled={product.stockQuantity === 0} style={{
                                flex: 1, padding: '16px', fontSize: '16px', fontWeight: '700', borderRadius: '12px',
                                border: '2px solid #e9d5ff', cursor: product.stockQuantity > 0 ? 'pointer' : 'not-allowed',
                                background: product.stockQuantity > 0 ? '#fff' : '#f5f5f5',
                                color: product.stockQuantity > 0 ? '#4c1d95' : '#6b7280',
                                fontFamily: "'Inter', sans-serif", transition: 'all 0.3s'
                            }}
                                onMouseEnter={e => { if(product.stockQuantity) { e.target.style.background = '#f5f0ff'; e.target.style.borderColor = '#7c3aed'; }}}
                                onMouseLeave={e => { if(product.stockQuantity) { e.target.style.background = '#fff'; e.target.style.borderColor = '#e9d5ff'; }}}
                            >Buy Now</button>
                        </div>

                        {/* Product Info */}
                        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e9d5ff', padding: '20px' }}>
                            <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#1a0a2e', marginBottom: '15px' }}>Product Details</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f5f0ff' }}><span style={{ color: '#6b7280' }}>Category</span><span style={{ color: '#1a0a2e', fontWeight: '600' }}>{product.category}</span></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f5f0ff' }}><span style={{ color: '#6b7280' }}>Availability</span><span style={{ color: product.stockQuantity > 0 ? '#059669' : '#dc2626', fontWeight: '600' }}>{product.stockQuantity} units</span></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f5f0ff' }}><span style={{ color: '#6b7280' }}>Product ID</span><span style={{ color: '#1a0a2e', fontWeight: '600' }}>#{product.id}</span></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}><span style={{ color: '#6b7280' }}>Added On</span><span style={{ color: '#1a0a2e', fontWeight: '600' }}>{product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* REVIEWS */}
                <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #e9d5ff', padding: '30px', boxShadow: '0 10px 40px rgba(76,29,149,0.04)' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1a0a2e', marginBottom: '20px' }}>
                        Reviews ({reviews.length}) {avgRating > 0 && `• ${'⭐'.repeat(Math.round(avgRating))} ${avgRating}/5`}
                    </h3>

                    {/* Add Review */}
                    <div style={{ background: '#faf8ff', padding: '20px', borderRadius: '14px', marginBottom: '25px', border: '1px solid #f5f0ff' }}>
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                            {[1,2,3,4,5].map(star => (
                                <span key={star} onClick={() => setNewReview({...newReview, rating: star})} style={{
                                    fontSize: '26px', cursor: 'pointer', transition: 'all 0.2s',
                                    filter: star <= newReview.rating ? 'none' : 'grayscale(100%)'
                                }}>⭐</span>
                            ))}
                        </div>
                        <textarea placeholder="Share your experience..." value={newReview.comment}
                            onChange={e => setNewReview({...newReview, comment: e.target.value})}
                            style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '2px solid #e9d5ff', fontSize: '14px', fontFamily: "'Inter', sans-serif", resize: 'vertical', height: '70px', boxSizing: 'border-box', outline: 'none', background: '#fff', marginBottom: '12px' }} />
                        <button onClick={submitReview} style={{
                            padding: '10px 24px', background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', color: '#fff',
                            border: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '13px', cursor: 'pointer',
                            fontFamily: "'Inter', sans-serif", boxShadow: '0 4px 15px rgba(76,29,149,0.15)'
                        }}>Submit Review</button>
                    </div>

                    {/* Reviews List */}
                    {reviews.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#6b7280', padding: '30px', fontSize: '14px' }}>No reviews yet. Be the first to review!</p>
                    ) : (
                        reviews.map(r => (
                            <div key={r.id} style={{ padding: '18px 0', borderBottom: '1px solid #f5f0ff' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px' }}>{r.username?.charAt(0).toUpperCase()}</div>
                                        <span style={{ fontWeight: '600', color: '#1a0a2e', fontSize: '14px' }}>{r.username}</span>
                                    </div>
                                    <span style={{ color: '#ff9f00', fontSize: '13px' }}>{'⭐'.repeat(r.rating)}</span>
                                </div>
                                <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.6', marginBottom: '6px' }}>{r.comment}</p>
                                <p style={{ color: '#6b7280', fontSize: '11px' }}>{new Date(r.createdAt).toLocaleDateString()}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* FOOTER */}
            <footer style={{ background: '#fff', borderTop: '1px solid #e9d5ff', padding: '20px', textAlign: 'center', fontSize: '12px', color: '#6b7280', fontFamily: "'Inter', sans-serif", marginTop: '50px' }}>
                © 2026 e-shop. All rights reserved.
            </footer>
        </div>
    );
}

export default ProductDetail;