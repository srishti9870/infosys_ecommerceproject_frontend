import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { getToken, getCurrentUser } from '../services/api';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8080/api';

function WishlistPage() {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [scrolled, setScrolled] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [recommended, setRecommended] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    
    const user = getCurrentUser();
    const token = getToken();
    const theme = useTheme();
    const c = theme.colors;
    const darkGradient = 'linear-gradient(160deg, #1a0a2e, #2d1b4e, #4c1d95)';

    useEffect(() => {
        if (user) {
            loadWishlist();
            loadRecommended();
        }
        window.addEventListener('scroll', () => setScrolled(window.scrollY > 60));
        return () => window.removeEventListener('scroll', () => {});
    }, [user]);

    const loadWishlist = async () => {
        try {
            const res = await axios.get(`${API_URL}/wishlist/${user.userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWishlist(res.data || []);
        } catch (err) {} finally { setLoading(false); }
    };

    const loadRecommended = async () => {
        try {
            const res = await axios.get(`${API_URL}/products?page=0&size=4`);
            const data = res.data.products || res.data || [];
            setRecommended(Array.isArray(data) ? data.slice(0, 4) : []);
        } catch (err) {}
    };

    const removeFromWishlist = async (productId) => {
        try {
            await axios.delete(`${API_URL}/wishlist/${user.userId}/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWishlist(prev => prev.filter(item => item.product?.id !== productId));
        } catch (err) {}
    };

    const addToCart = async (product) => {
        try {
            await axios.post(`${API_URL}/cart`, {
                userId: user.userId, product: { id: product.id }, quantity: 1
            }, { headers: { Authorization: `Bearer ${token}` } });
            alert('✅ Added to cart!');
        } catch (err) { alert('Failed to add to cart'); }
    };
	const moveAllToCart = async () => {
	    if (wishlist.length === 0) {
	        alert('Your wishlist is empty!');
	        return;
	    }
	    
	    let addedCount = 0;
	    for (let item of wishlist) {
	        if (item.product?.stockQuantity > 0) {
	            try {
	                await axios.post(`${API_URL}/cart`, {
	                    userId: user.userId, product: { id: item.product.id }, quantity: 1
	                }, { headers: { Authorization: `Bearer ${token}` } });
	                addedCount++;
	            } catch (err) {}
	        }
	    }
	    
	    if (addedCount > 0) {
	        alert(`✅ ${addedCount} item(s) moved to cart successfully!`);
	        loadWishlist();
	    } else {
	        alert('No items could be moved to cart.');
	    }
	};

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) window.location.href = `/products?search=${searchQuery}`;
    };

    const getImage = (product) => {
        if (product?.imageUrl?.startsWith('/uploads')) return `http://localhost:8080${product.imageUrl}`;
        const imgs = {
            'Smartphones': '/images/smartphones.jpg',
            'Electronics': '/images/smartphones.jpg',
            'Laptops': '/images/laptop.jpg',
            'Audio': '/images/audio.jpg',
            'Wearables': '/images/wearables.jpg',
            'Fashion': '/images/fashion.jpg',
            'Sports': '/images/sports.jpg',
        };
        return imgs[product?.category] || '/images/default.jpg';
    };

    if (!token) return <Navigate to="/login" />;

    return (
        <div style={{ background: c.bg, minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: c.text }}>

            {/* PREMIUM NAVBAR */}
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
                padding: scrolled ? '6px 0' : '14px 0',
                background: scrolled ? 'rgba(255,255,255,0.95)' : '#fff',
                backdropFilter: scrolled ? 'blur(30px) saturate(180%)' : 'none',
                boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.06)' : 'none',
                borderBottom: `1px solid ${c.border}`,
                transition: 'all 0.4s ease',
            }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    
                    {/* LOGO */}
                    <Link to="/home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: darkGradient, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '19px', boxShadow: '0 8px 25px rgba(76,29,149,0.3)' }}>E</div>
                        <div>
                            <span style={{ fontSize: '22px', fontWeight: '800', color: c.text, letterSpacing: '-0.5px', display: 'block', lineHeight: '1.1' }}>e-shop</span>
                            <span style={{ fontSize: '9px', fontWeight: '600', color: c.primary, letterSpacing: '3px', textTransform: 'uppercase' }}>Premium Store</span>
                        </div>
                    </Link>

                    {/* SEARCH */}
                    <form onSubmit={handleSearch} style={{ flex: '0 1 400px', position: 'relative' }}>
                        <input type="text" placeholder="Search products..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                            style={{ width: '100%', padding: '12px 50px 12px 18px', borderRadius: '12px', border: `2px solid ${c.border}`, outline: 'none', fontSize: '14px', fontFamily: "'Inter', sans-serif", background: c.input, color: c.text, boxSizing: 'border-box' }} />
                        <button type="submit" style={{ position: 'absolute', right: '4px', top: '4px', bottom: '4px', width: '38px', borderRadius: '10px', border: 'none', background: darkGradient, color: '#fff', cursor: 'pointer' }}>⌕</button>
                    </form>

                    {/* NAV LINKS */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <button onClick={theme.toggleTheme} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', padding: '8px 10px', color: c.text }}>{theme.isDark ? '☀️' : '🌙'}</button>
                        {['Home', 'Cart', 'Orders'].map(l => (
                            <Link key={l} to={`/${l.toLowerCase()}`} style={{ color: l === 'Wishlist' ? c.primary : c.text2, textDecoration: 'none', fontWeight: l === 'Wishlist' ? '600' : '500', fontSize: '14px', padding: '10px 16px', borderRadius: '10px', transition: 'all 0.2s' }}
                                onMouseEnter={e => { e.target.style.background = c.hover; }}
                                onMouseLeave={e => { e.target.style.background = 'transparent'; }}>{l}</Link>
                        ))}
                        {user && (
                            <div style={{ position: 'relative', marginLeft: '8px' }} onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: darkGradient, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>{user?.username?.charAt(0).toUpperCase()}</div>
                                {showDropdown && (
                                    <div style={{ position: 'absolute', top: '44px', right: 0, background: c.card, borderRadius: '12px', boxShadow: '0 20px 50px rgba(0,0,0,0.12)', padding: '6px', minWidth: '160px', zIndex: 10, border: `1px solid ${c.border}` }}>
                                        <Link to="/profile" style={dd(c)}>Profile</Link>
                                        <span onClick={handleLogout} style={{...dd(c), color: '#ef4444'}}>Logout</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <div style={{ maxWidth: '1300px', margin: '100px auto 40px', padding: '0 30px' }}>

                {/* HERO BANNER */}
                <div style={{ 
                    background: darkGradient, borderRadius: '24px', padding: '40px 50px', 
                    color: '#fff', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', 
                    alignItems: 'center', position: 'relative', overflow: 'hidden' 
                }}>
                    <div style={{ position: 'absolute', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', top: '-20%', right: '5%' }}></div>
                    <div>
                        <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', background: 'rgba(255,255,255,0.15)', padding: '5px 14px', borderRadius: '20px' }}>❤️ My Wishlist</span>
                        <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '15px 0 8px' }}>{wishlist.length} Saved Items</h1>
                        <p style={{ opacity: '0.8', fontSize: '14px' }}>Your curated collection of favorite products</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={moveAllToCart} style={{ padding: '12px 24px', background: '#fff', color: '#4c1d95', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>Move All to Cart →</button>
						<button 
						    onClick={() => window.location.href = '/products'}
						    style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '10px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}
						>
						    Add More Items
						</button>
						</div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '80px' }}>
                        <div style={{ width: '44px', height: '44px', border: '3px solid #e9d5ff', borderTopColor: '#7c3aed', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 20px' }}></div>
                        <p style={{ color: c.text2 }}>Loading your wishlist...</p>
                    </div>
                ) : wishlist.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 30px', background: c.card, borderRadius: '24px', border: `1px solid ${c.border}` }}>
                        <div style={{ fontSize: '80px', marginBottom: '20px' }}>🤍</div>
                        <h2 style={{ fontSize: '24px', fontWeight: '700', color: c.text, marginBottom: '10px' }}>Your wishlist is empty</h2>
                        <p style={{ color: c.text2, fontSize: '15px', marginBottom: '30px' }}>Start exploring and save items you love!</p>
                        <Link to="/home" style={{ padding: '16px 36px', background: darkGradient, color: '#fff', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '15px', display: 'inline-block', boxShadow: '0 8px 30px rgba(76,29,149,0.3)' }}>Explore Products</Link>
                    </div>
                ) : (
                    <>
                        {/* WISHLIST GRID */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '22px', marginBottom: '60px' }}>
                            {wishlist.map(item => (
                                <div key={item.id} style={{
                                    background: c.card, borderRadius: '20px', border: `1px solid ${c.border}`,
                                    overflow: 'hidden', transition: 'all 0.35s', position: 'relative'
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.1)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                                    
                                    <button onClick={() => removeFromWishlist(item.product?.id)} style={{
                                        position: 'absolute', top: '14px', right: '14px', zIndex: 2,
                                        width: '34px', height: '34px', borderRadius: '50%',
                                        background: 'rgba(255,255,255,0.9)', border: 'none',
                                        cursor: 'pointer', fontSize: '18px', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center',
                                        backdropFilter: 'blur(10px)', transition: 'all 0.3s', color: '#dc2626'
                                    }}
                                        onMouseEnter={e => { e.target.style.background = '#dc2626'; e.target.style.color = '#fff'; }}
                                        onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.9)'; e.target.style.color = '#dc2626'; }}
                                    >×</button>

                                    <Link to={`/product/${item.product?.id}`}>
                                        <div style={{ height: '250px', overflow: 'hidden', background: c.bg2, position: 'relative' }}>
                                            <img src={getImage(item.product)} alt={item.product?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            {item.product?.stockQuantity <= 5 && item.product?.stockQuantity > 0 && (
                                                <span style={{ position: 'absolute', top: '14px', left: '14px', padding: '5px 12px', background: '#f59e0b', color: '#fff', borderRadius: '8px', fontSize: '11px', fontWeight: '700' }}>Only {item.product.stockQuantity} left</span>
                                            )}
                                            {item.product?.stockQuantity === 0 && (
                                                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <span style={{ background: '#ef4444', color: '#fff', padding: '8px 16px', borderRadius: '8px', fontWeight: '700', fontSize: '14px' }}>Sold Out</span>
                                                </div>
                                            )}
                                        </div>
                                    </Link>

                                    <div style={{ padding: '20px' }}>
                                        <span style={{ fontSize: '10px', fontWeight: '700', color: c.primary, textTransform: 'uppercase', letterSpacing: '1px' }}>{item.product?.category}</span>
                                        <Link to={`/product/${item.product?.id}`} style={{ textDecoration: 'none' }}>
                                            <h4 style={{ fontSize: '16px', fontWeight: '600', color: c.text, margin: '8px 0 4px' }}>{item.product?.name}</h4>
                                        </Link>
                                        <div style={{ color: '#f59e0b', fontSize: '12px', marginBottom: '12px' }}>★★★★★ <span style={{ color: c.text2 }}>4.8</span></div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                            <div>
                                                <span style={{ fontSize: '22px', fontWeight: '700', color: c.text }}>₹{Number(item.product?.price).toLocaleString()}</span>
                                                <span style={{ fontSize: '12px', color: c.text2, textDecoration: 'line-through', marginLeft: '8px' }}>₹{Number(item.product?.price * 1.4).toLocaleString()}</span>
                                            </div>
                                            <span style={{ fontSize: '11px', fontWeight: '700', color: '#059669', background: '#ecfdf5', padding: '3px 8px', borderRadius: '4px' }}>29% off</span>
                                        </div>
                                        <button onClick={() => addToCart(item.product)} disabled={!item.product?.stockQuantity}
                                            style={{
                                                width: '100%', padding: '12px', borderRadius: '10px', border: 'none',
                                                fontWeight: '600', fontSize: '14px', fontFamily: "'Inter', sans-serif",
                                                cursor: item.product?.stockQuantity ? 'pointer' : 'not-allowed',
                                                background: item.product?.stockQuantity ? darkGradient : c.border,
                                                color: '#fff', transition: 'all 0.3s'
                                            }}>
                                            {item.product?.stockQuantity > 0 ? '🛒 Add to Cart' : 'Out of Stock'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* RECOMMENDED PRODUCTS */}
                        {recommended.length > 0 && (
                            <div style={{ marginTop: '60px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                                    <div>
                                        <span style={{ fontSize: '12px', fontWeight: '700', color: c.primary, letterSpacing: '3px', textTransform: 'uppercase' }}>Recommended</span>
                                        <h2 style={{ fontSize: '28px', fontWeight: '800', color: c.text, margin: '8px 0' }}>You Might Also Like</h2>
                                    </div>
                                    <Link to="/products" style={{ color: c.primary, textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>View All →</Link>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                                    {recommended.map((p, i) => (
                                        <Link to={`/product/${p.id}`} key={i} style={{ textDecoration: 'none' }}>
                                            <div style={{ background: c.card, borderRadius: '16px', overflow: 'hidden', border: `1px solid ${c.border}`, transition: 'all 0.3s', cursor: 'pointer' }}
                                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.08)'; }}
                                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                                                <div style={{ height: '200px', overflow: 'hidden', background: c.bg2 }}>
                                                    <img src={getImage(p)} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>
                                                <div style={{ padding: '15px' }}>
                                                    <span style={{ fontSize: '10px', fontWeight: '700', color: c.primary, textTransform: 'uppercase' }}>{p.category}</span>
                                                    <h4 style={{ fontSize: '14px', fontWeight: '600', color: c.text, margin: '4px 0' }}>{p.name}</h4>
                                                    <span style={{ fontSize: '16px', fontWeight: '700', color: c.text }}>₹{Number(p.price).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* FOOTER */}
            <footer style={{ background: '#0a0a0a', color: '#e9d5ff', padding: '40px 30px', textAlign: 'center', marginTop: '60px' }}>
                <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', fontSize: '13px' }}>
                    <span style={{ opacity: '0.7' }}>© 2026 e-shop. All rights reserved.</span>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        {['Privacy Policy', 'Terms of Service', 'Returns Policy'].map(l => <span key={l} style={{ cursor: 'pointer', opacity: '0.7' }}>{l}</span>)}
                    </div>
                    <span style={{ opacity: '0.7' }}>Made with 💜 in India</span>
                </div>
            </footer>
        </div>
    );
}

const dd = (c) => ({ display: 'block', padding: '10px 16px', borderRadius: '10px', color: c.text, textDecoration: 'none', fontSize: '13px', fontWeight: '600' });

export default WishlistPage;