import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts, getCurrentUser, logoutUser,getToken } from '../services/api';
import axios from 'axios';
const API_URL = 'http://localhost:54362/api';

function HomePage() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
	const [cartCount, setCartCount] = useState(0);
    const user = getCurrentUser();
	

    const slides = [
        {
            title: 'Top Selling Smartphones',
            subtitle: 'Starting from just ₹6,999',
            tag: 'Mega Sale',
            image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
            bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
        },
        {
            title: 'Premium Audio Experience',
            subtitle: 'Wireless earbuds & headphones up to 50% off',
            tag: 'New Launch',
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
            bg: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 100%)'
        },
        {
            title: 'Laptops for Every Need',
            subtitle: 'From work to gaming, find your perfect match',
            tag: 'Special Offer',
            image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80',
            bg: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f23 100%)'
        },
        {
            title: 'Style Meets Comfort',
            subtitle: 'Trending fashion & accessories collection',
            tag: 'Trending',
            image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80',
            bg: 'linear-gradient(135deg, #16213e 0%, #1a1a2e 100%)'
        }
    ];

    const allCategories = [
        { name: 'Smartphones', image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&q=80' },
        { name: 'Laptops', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&q=80' },
        { name: 'Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80' },
        { name: 'Smartwatches', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80' },
        { name: 'Cameras', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&q=80' },
        { name: 'Fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&q=80' },
        { name: 'Sports', image: 'https://images.unsplash.com/photo-1461896836934-bd45ba4fcf69?w=300&q=80' },
        { name: 'Home', image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=300&q=80' },
        { name: 'Beauty', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc8?w=300&q=80' },
        { name: 'Books', image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300&q=80' },
    ];

    const getProductImage = (category, index) => {
        const images = {
            'Smartphones': ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=80', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80'],
            'Electronics': ['https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80', 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400&q=80'],
            'Headphones': ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80', 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80'],
            'Laptops': ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80', 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&q=80'],
            'Fashion': ['https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80'],
            'Sports': ['https://images.unsplash.com/photo-1461896836934-bd45ba4fcf69?w=400&q=80', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80'],
            'Beauty': ['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc8?w=400&q=80', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80'],
            'Home': ['https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&q=80', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80'],
            'Books': ['https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&q=80', 'https://images.unsplash.com/photo-1526243741027-444d633d7365?w=400&q=80'],
        };
        const imgs = images[category] || ['https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400&q=80', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80'];
        return imgs[index % 2];
    };

	useEffect(() => {
	    loadProducts();
	    loadCartCount();
	    const slideInterval = setInterval(() => {
	        setCurrentSlide(prev => (prev + 1) % slides.length);
	    }, 4000);
	    return () => clearInterval(slideInterval);
	}, []);

    const loadProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data.slice(0, 8));
        } catch (err) {}
    };

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };
	const loadCartCount = async () => {
	    if (!user) return;
	    try {
	        const response = await axios.get(`${API_URL}/cart/${user.userId}`, {
	            headers: { Authorization: `Bearer ${getToken()}` }
	        });
	        setCartCount(response.data.length);
	    } catch (err) {}
	};

    return (
        <div style={{ background: '#f1f2f4', minHeight: '100vh', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", overflowX: 'hidden' }}>
            
            {/* TOP BAR */}
            <div style={{ background: '#ffffff', borderBottom: '1px solid #f0f0f0', padding: '8px 0', fontSize: '12px', color: '#666' }}>
                <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 30px', display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '25px' }}>
                        <span style={{ cursor: 'pointer' }}>Become a Seller</span>
                        <span style={{ cursor: 'pointer' }}>Advertise</span>
                        <span style={{ cursor: 'pointer' }}>Gift Cards</span>
                        <span style={{ cursor: 'pointer' }}>Help Center</span>
                    </div>
                    <div style={{ display: 'flex', gap: '25px' }}>
                        <span style={{ cursor: 'pointer' }}>Track Order</span>
                        <span style={{ cursor: 'pointer' }}>English</span>
                    </div>
                </div>
            </div>

            {/* NAVBAR */}
            <nav style={{ background: '#2874f0', padding: '12px 0', position: 'sticky', top: 0, zIndex: 1000 }}>
                <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '30px' }}>
                    
                    {/* LOGO */}
                    <Link to="/home" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '90px', flexShrink: 0 }}>
                        <span style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.5px' }}>e-shop</span>
                        <span style={{ fontSize: '10px', color: '#c8dfff', fontStyle: 'italic' }}>Explore <span style={{ color: '#ffc107', fontWeight: '700' }}>Plus</span></span>
                    </Link>

                    {/* SEARCH BAR */}
                    <div style={{ flex: 1, maxWidth: '600px', position: 'relative', minWidth: '280px' }}>
                        <input 
                            type="text" 
                            placeholder="Search for products, brands and more" 
                            style={{
                                width: '100%', padding: '12px 55px 12px 20px', borderRadius: '2px',
                                border: 'none', fontSize: '14px', outline: 'none',
                                boxSizing: 'border-box', fontFamily: "'Inter', sans-serif"
                            }} 
                        />
                        <button style={{
                            position: 'absolute', right: 0, top: 0, height: '100%',
                            width: '48px', background: 'transparent', border: 'none',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="#2874f0"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                        </button>
                    </div>

                    {/* RIGHT SIDE - USER, WISHLIST, CART */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '40px', flexShrink: 0 }}>
                        
                        {/* User */}
                        <div style={{ position: 'relative' }} onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}>
                            {user ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '5px 0' }}>
                                    <div style={{
                                        width: '34px', height: '34px', borderRadius: '50%',
                                        background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.5)',
                                        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '15px', fontWeight: '700'
                                    }}>
                                        {user?.username?.charAt(0).toUpperCase()}
                                    </div>
                                    <span style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>{user.username}</span>
                                </div>
                            ) : (
                                <Link to="/login" style={{ color: '#2874f0', background: 'white', padding: '8px 30px', borderRadius: '2px', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>
                                    Login
                                </Link>
                            )}
                            {showDropdown && user && (
                                <div style={{ position: 'absolute', top: '110%', right: 0, background: 'white', borderRadius: '4px', boxShadow: '0 8px 30px rgba(0,0,0,0.15)', padding: '12px 0', minWidth: '200px', zIndex: 100 }}>
                                   {user?.role === 'ADMIN' && ( <Link to="/admin" style={{ display: 'block', padding: '10px 25px', fontSize: '14px', color: '#333', textDecoration: 'none' }}>My Dashboard</Link>)}
                                    <Link to="/orders" style={{ display: 'block', padding: '10px 25px', fontSize: '14px', color: '#333', textDecoration: 'none' }}>Orders</Link>
                                    <div style={{ borderTop: '1px solid #f0f0f0', margin: '8px 0' }}></div>
                                    <span onClick={handleLogout} style={{ display: 'block', padding: '10px 25px', fontSize: '14px', color: '#e74c3c', cursor: 'pointer' }}>Logout</span>
                                </div>
                            )}
                        </div>

                        {/* Wishlist */}
                        <span style={{ color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>Wishlist</span>

                        {/* Cart */}
                        <div style={{ position: 'relative', cursor: 'pointer' }}>
						<Link to="/cart" style={{ color: 'white', fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap', cursor: 'pointer', position: 'relative', textDecoration: 'none' }}>
						    Cart
						    {cartCount > 0 && (
						        <span style={{ position: 'absolute', top: '-8px', right: '-12px', background: '#ff6161', color: 'white', fontSize: '10px', padding: '2px 7px', borderRadius: '10px', fontWeight: '700' }}>
						            {cartCount}
						        </span>
						    )}
						</Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* CAROUSEL */}
            <div style={{ ...styles.carousel, background: slides[currentSlide].bg }}>
                <div style={styles.carouselContent}>
                    <span style={styles.carouselTag}>{slides[currentSlide].tag}</span>
                    <h1 style={styles.carouselTitle}>{slides[currentSlide].title}</h1>
                    <p style={styles.carouselSub}>{slides[currentSlide].subtitle}</p>
                    <Link to="/products" style={styles.carouselBtn}>Shop Now</Link>
                </div>
                <img src={slides[currentSlide].image} alt="" style={styles.carouselImage} />
                
                <div style={styles.slideDots}>
                    {slides.map((_, i) => (
                        <button key={i} onClick={() => setCurrentSlide(i)} style={{
                            ...styles.dot,
                            background: i === currentSlide ? '#ffffff' : 'rgba(255,255,255,0.4)',
                            width: i === currentSlide ? '28px' : '8px'
                        }}></button>
                    ))}
                </div>
                <button onClick={() => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length)} style={{...styles.arrow, left: '20px'}}>‹</button>
                <button onClick={() => setCurrentSlide(prev => (prev + 1) % slides.length)} style={{...styles.arrow, right: '20px'}}>›</button>
            </div>

            {/* CATEGORIES */}
            <section style={{ background: '#ffffff', margin: '10px 0', padding: '25px 0' }}>
                <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 30px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#212121', marginBottom: '20px' }}>Shop by Category</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '15px' }}>
                        {allCategories.map((cat, i) => (
                            <div key={i} style={{ textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s' }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                <div style={{ width: '95px', height: '95px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 10px', border: '1px solid #f0f0f0' }}>
                                    <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <p style={{ fontSize: '12px', fontWeight: '600', color: '#212121', margin: 0 }}>{cat.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURED PRODUCTS */}
            <section style={{ background: '#ffffff', margin: '10px 0', padding: '25px 0' }}>
                <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#212121', margin: 0 }}>Featured Products</h2>
                        <Link to="/products" style={{ background: '#2874f0', color: 'white', padding: '10px 25px', borderRadius: '2px', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>View All</Link>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                        {products.map((p, idx) => (
                            <Link to={`/product/${p.id}`} key={p.id} style={{ textDecoration: 'none' }}>
                                <div style={{ border: '1px solid #f0f0f0', borderRadius: '4px', overflow: 'hidden', transition: 'box-shadow 0.3s' }}
                                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)'}
                                    onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
                                    <div style={{ height: '220px', background: '#fafafa', overflow: 'hidden' }}>
                                        <img src={getProductImage(p.category, idx)} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ padding: '15px 18px' }}>
                                        <p style={{ fontSize: '14px', fontWeight: '600', color: '#212121', margin: '0 0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</p>
                                        <p style={{ fontSize: '11px', color: '#878787', margin: '0 0 10px' }}>{p.category}</p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '17px', fontWeight: '700', color: '#212121' }}>₹{Number(p.price).toLocaleString()}</span>
                                            <span style={{ fontSize: '11px', color: '#388e3c', fontWeight: '600' }}>In Stock</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* SERVICES BAR */}
            <div style={{ background: '#ffffff', margin: '10px 0', padding: '35px 0' }}>
                <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 30px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px', textAlign: 'center' }}>
                    {[
                        { title: 'Free Delivery', desc: 'For orders above ₹499', icon: '🚚' },
                        { title: 'Secure Payment', desc: '100% protected transactions', icon: '🔒' },
                        { title: 'Easy Returns', desc: '30-day return policy', icon: '↩️' },
                        { title: '24/7 Support', desc: 'Dedicated customer care', icon: '💬' },
                    ].map((s, i) => (
                        <div key={i}>
                            <div style={{ width: '55px', height: '55px', borderRadius: '50%', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', fontSize: '24px' }}>{s.icon}</div>
                            <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#212121', margin: '0 0 6px' }}>{s.title}</h4>
                            <p style={{ fontSize: '12px', color: '#878787', margin: 0 }}>{s.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* FOOTER */}
            <footer style={{ background: '#172337', color: '#ffffff', padding: '50px 30px 30px', marginTop: '10px' }}>
                <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 1fr', gap: '50px' }}>
                    <div>
                        <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#ffffff', marginBottom: '15px', letterSpacing: '1px' }}>e-shop</h3>
                        <p style={{ fontSize: '13px', color: '#878787', lineHeight: '1.8', maxWidth: '350px' }}>
                            Your one-stop destination for electronics, fashion, home essentials and more. Quality products, competitive prices, and exceptional service.
                        </p>
                        <div style={{ display: 'flex', gap: '15px', marginTop: '20px', fontSize: '18px' }}>
                            <span style={{ cursor: 'pointer', background: '#2a3a4a', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>f</span>
                            <span style={{ cursor: 'pointer', background: '#2a3a4a', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</span>
                            <span style={{ cursor: 'pointer', background: '#2a3a4a', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📷</span>
                        </div>
                    </div>
                    <div>
                        <h4 style={{ fontSize: '13px', color: '#878787', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>About</h4>
                        {['Contact Us','About Us','Careers','Press','Blog'].map(t => (
                            <p key={t} style={{ fontSize: '13px', margin: '10px 0', cursor: 'pointer', fontWeight: '400', lineHeight: '1.8' }}>{t}</p>
                        ))}
                    </div>
                    <div>
                        <h4 style={{ fontSize: '13px', color: '#878787', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Policy</h4>
                        {['Privacy Policy','Terms of Use','Security','Sitemap','Returns'].map(t => (
                            <p key={t} style={{ fontSize: '13px', margin: '10px 0', cursor: 'pointer', fontWeight: '400', lineHeight: '1.8' }}>{t}</p>
                        ))}
                    </div>
                    <div>
                        <h4 style={{ fontSize: '13px', color: '#878787', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Contact</h4>
                        <p style={{ fontSize: '13px', margin: '10px 0', lineHeight: '1.8' }}>support@eshop.com</p>
                        <p style={{ fontSize: '13px', margin: '10px 0', lineHeight: '1.8' }}>1800-123-4567</p>
                        <p style={{ fontSize: '13px', margin: '10px 0', lineHeight: '1.8' }}>Mumbai, India</p>
                    </div>
                </div>
                <div style={{ borderTop: '1px solid #2a3a4a', marginTop: '40px', paddingTop: '25px', textAlign: 'center', fontSize: '12px', color: '#878787' }}>
                    © 2026 e-shop. All rights reserved.
                </div>
            </footer>
        </div>
    );
}

const styles = {
    carousel: {
        padding: '50px 60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: '320px',
        position: 'relative',
        overflow: 'hidden'
    },
    carouselContent: { maxWidth: '450px', zIndex: 1 },
    carouselTag: {
        display: 'inline-block', padding: '4px 12px', background: 'rgba(255,255,255,0.15)',
        color: '#ffc107', borderRadius: '3px', fontSize: '12px', fontWeight: '700',
        textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px'
    },
    carouselTitle: { fontSize: '38px', fontWeight: '800', color: '#ffffff', margin: '0 0 12px 0', lineHeight: '1.2' },
    carouselSub: { fontSize: '16px', color: '#b0b0d0', marginBottom: '25px', lineHeight: '1.5' },
    carouselBtn: {
        padding: '14px 35px', background: '#2874f0', color: '#ffffff', borderRadius: '3px',
        textDecoration: 'none', fontWeight: '700', fontSize: '15px', display: 'inline-block'
    },
    carouselImage: {
        width: '400px', height: '280px', objectFit: 'cover', borderRadius: '12px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.3)', zIndex: 1
    },
    slideDots: { position: 'absolute', bottom: '25px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', alignItems: 'center' },
    dot: { height: '8px', borderRadius: '4px', border: 'none', cursor: 'pointer', transition: 'all 0.3s', padding: 0 },
    arrow: {
        position: 'absolute', top: '50%', transform: 'translateY(-50%)',
        background: 'rgba(255,255,255,0.15)', color: 'white', border: 'none',
        width: '45px', height: '45px', borderRadius: '50%', fontSize: '26px',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2
    }
};

export default HomePage;