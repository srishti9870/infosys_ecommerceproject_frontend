import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts, getCurrentUser, logoutUser, getToken } from '../services/api';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';

const API_URL = 'http://localhost:8080/api';

function HomePage() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [testimonialIndex, setTestimonialIndex] = useState(0);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [newsletterEmail, setNewsletterEmail] = useState('');
	const [animatedSections, setAnimatedSections] = useState({});
	const [couponClosed, setCouponClosed] = useState(false);
	const [cartCount, setCartCount] = useState(0);

    const user = getCurrentUser();
    const token = getToken();

    const theme = useTheme();
    const c = theme.colors;
    const darkGradient = 'linear-gradient(160deg, #1a0a2e, #2d1b4e, #4c1d95)';

    const slides = [
        { tag: 'New Collection 2026', title: 'Elevate Your Lifestyle', subtitle: 'Discover premium products curated for the modern you', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=80', cta: 'Explore Collection', secondaryCta: 'View Deals' },
        { tag: 'Exclusive Offer', title: 'Up to 40% Off', subtitle: 'Limited time deals on top brands and premium items', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&q=80', cta: 'Shop Sale', secondaryCta: 'Learn More' },
        { tag: 'Free Shipping', title: 'Delivered to Your Door', subtitle: 'Free express delivery on all orders above ₹999', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400&q=80', cta: 'Start Shopping', secondaryCta: 'See Details' },
    ];
    const testimonials = [
        { name: 'Priya Sharma', role: 'Verified Buyer', text: 'Exceptional quality and lightning-fast delivery. The packaging was premium and the product exceeded my expectations.' },
        { name: 'Rahul Mehta', role: 'Premium Member', text: 'Best online shopping experience I have ever had. The curated collections are absolutely stunning.' },
        { name: 'Ananya Patel', role: 'Regular Customer', text: 'Outstanding customer service and product quality. I recommend e-shop to everyone I know.' },
    ];

    const categories = [
        { name: 'Smartphones', image: '/images/smartphones.jpg' },
        { name: 'Laptops', image: '/images/laptop.jpg' },
        { name: 'Audio', image: '/images/audio.jpg' },
        { name: 'Wearables', image: '/images/wearables.jpg' },
        { name: 'Fashion', image: '/images/fashion.jpg' },
        { name: 'Sports', image: '/images/sports.jpg' },
    ];

    useEffect(() => {
        loadProducts();
		loadCartCount();
        const sI = setInterval(() => setCurrentSlide(prev => (prev + 1) % slides.length), 5000);
        const tI = setInterval(() => setTestimonialIndex(prev => (prev + 1) % testimonials.length), 4000);
        window.addEventListener('scroll', () => { setScrolled(window.scrollY > 60); setShowBackToTop(window.scrollY > 500); });
        return () => { clearInterval(sI); clearInterval(tI); };
    }, []);

    const loadProducts = async () => {
        try {
            const res = await axios.get(`${API_URL}/products?page=0&size=8`);
            const data = res.data.products || res.data || [];
            setProducts(Array.isArray(data) ? data.slice(0, 8) : []);
        } catch (err) {}
    };
	const loadCartCount = async () => {
	    if (!user || !token) return;
	    try {
	        const res = await axios.get(`${API_URL}/cart/${user.userId}`, {
	            headers: { Authorization: `Bearer ${token}` }
	        });
	        console.log('Cart API Response:', res.data);  // Debug
	        setCartCount(res.data.length || 0);
	    } catch (err) {
	        console.log('Cart load error:', err);
	        setCartCount(0);
	    }
	};

    const handleSearch = (e) => { e.preventDefault(); if (searchQuery.trim()) navigate(`/products?search=${searchQuery}`); };
    const handleLogout = () => { logoutUser(); navigate('/login'); };
    const handleNewsletter = (e) => { e.preventDefault(); alert('Subscribed successfully!'); setNewsletterEmail(''); };

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

    return (
        <div style={{ background: c.bg, fontFamily: "'Inter', sans-serif", overflow: 'hidden', color: c.text, minHeight: '100vh' }}>

            {/* NAVBAR */}
			{/* NAVBAR */}
			<nav style={{
			    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
			    padding: scrolled ? '6px 0' : '18px 0',
			    background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
			    backdropFilter: scrolled ? 'blur(30px) saturate(180%)' : 'none',
			    WebkitBackdropFilter: scrolled ? 'blur(30px) saturate(180%)' : 'none',
			    boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.06)' : 'none',
			    borderBottom: scrolled ? `1px solid ${c.border}` : '1px solid transparent',
			    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
			}}>
			    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
			        
			        {/* LOGO */}
			        <Link to="/home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
			            <div style={{ 
			                width: '42px', height: '42px', 
			                borderRadius: '14px', 
			                background: darkGradient, 
			                color: '#fff', 
			                display: 'flex', alignItems: 'center', justifyContent: 'center', 
			                fontWeight: '800', fontSize: '19px',
			                boxShadow: '0 8px 25px rgba(76,29,149,0.3)',
			                transition: 'all 0.3s ease'
			            }}
			                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05) rotate(-5deg)'; }}
			                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1) rotate(0)'; }}
			            >E</div>
			            <div>
			                <span style={{ fontSize: '22px', fontWeight: '800', color: scrolled ? c.text : '#fff', letterSpacing: '-0.5px', transition: 'color 0.3s', display: 'block', lineHeight: '1.1' }}>e-shop</span>
			                <span style={{ fontSize: '9px', fontWeight: '600', color: scrolled ? c.primary : 'rgba(255,255,255,0.7)', letterSpacing: '3px', textTransform: 'uppercase', transition: 'color 0.3s' }}>Premium Store</span>
			            </div>
			        </Link>

			        {/* SEARCH BAR */}
			        <form onSubmit={handleSearch} style={{ flex: '0 1 520px', position: 'relative' }}>
			            <div style={{ position: 'relative' }}>
			                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', opacity: '0.5', zIndex: 1 }}>🔍</span>
			                <input type="text" placeholder="Search for products, brands and more..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
			                    style={{ 
			                        width: '100%', padding: '13px 50px 13px 44px', borderRadius: '14px', 
			                        border: `2px solid ${scrolled ? c.border : 'rgba(255,255,255,0.25)'}`, 
			                        outline: 'none', fontSize: '14px', fontFamily: "'Inter', sans-serif", 
			                        background: scrolled ? c.input : 'rgba(255,255,255,0.1)', 
			                        color: scrolled ? c.text : '#fff', 
			                        transition: 'all 0.3s ease', 
			                        boxSizing: 'border-box',
			                        backdropFilter: scrolled ? 'none' : 'blur(10px)'
			                    }}
			                    onFocus={e => { e.target.style.borderColor = '#7c3aed'; e.target.style.boxShadow = '0 0 0 4px rgba(124,58,237,0.1)'; }}
			                    onBlur={e => { e.target.style.borderColor = scrolled ? c.border : 'rgba(255,255,255,0.25)'; e.target.style.boxShadow = 'none'; }}
			                />
			                <button type="submit" style={{ 
			                    position: 'absolute', right: '6px', top: '6px', bottom: '6px', 
			                    width: '38px', borderRadius: '10px', border: 'none', 
			                    background: darkGradient, color: '#fff', 
			                    cursor: 'pointer', fontSize: '16px',
			                    transition: 'all 0.3s ease'
			                }}
			                    onMouseEnter={e => { e.target.style.transform = 'scale(1.05)'; }}
			                    onMouseLeave={e => { e.target.style.transform = 'scale(1)'; }}
			                >⌕</button>
			            </div>
			        </form>

			        {/* RIGHT SIDE */}
			        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
			            
			            {/* THEME TOGGLE */}
			            <div style={{ 
			                width: '38px', height: '38px', borderRadius: '10px', 
			                display: 'flex', alignItems: 'center', justifyContent: 'center',
			                cursor: 'pointer', transition: 'all 0.3s',
			                background: scrolled ? 'transparent' : 'rgba(255,255,255,0.1)',
			            }}
			                onClick={theme.toggleTheme}
			                onMouseEnter={e => { e.currentTarget.style.background = c.hover; }}
			                onMouseLeave={e => { e.currentTarget.style.background = scrolled ? 'transparent' : 'rgba(255,255,255,0.1)'; }}
			            >
			                <span style={{ fontSize: '20px', color: scrolled ? c.text : '#fff' }}>{theme.isDark ? '☀️' : '🌙'}</span>
			            </div>

			            {/* NAV LINKS */}
			            {['Home', 'Wishlist', 'Orders', 'Cart'].map((l, i) => (
			                <Link key={l} to={`/${l.toLowerCase()}`} style={{ 
			                    color: scrolled ? c.text2 : 'rgba(255,255,255,0.85)', 
			                    textDecoration: 'none', fontWeight: i === 0 ? '600' : '500', 
			                    fontSize: '13px', padding: '10px 15px', borderRadius: '10px', 
			                    transition: 'all 0.25s ease',
			                    position: 'relative'
			                }}
			                    onMouseEnter={e => { e.target.style.background = c.hover; e.target.style.color = c.text; }}
			                    onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = i === 0 ? (scrolled ? c.primary : 'rgba(255,255,255,1)') : (scrolled ? c.text2 : 'rgba(255,255,255,0.85)'); }}
			                >
			                    {l}
								{l === 'Cart' && (
								    <span style={{ 
								        position: 'absolute', top: '2px', right: '2px', 
								        width: '18px', height: '18px', borderRadius: '50%', 
								        background: '#ef4444', color: '#fff', fontSize: '10px', 
								        display: 'flex', alignItems: 'center', justifyContent: 'center',
								        fontWeight: '700'
								    }}>
								        {cartCount > 0 ? cartCount : '0'}
								    </span>
								)}
			                </Link>
			            ))}

			            {/* DIVIDER */}
			            <div style={{ width: '1px', height: '24px', background: scrolled ? c.border : 'rgba(255,255,255,0.2)', margin: '0 8px' }}></div>

			            {/* USER */}
			            {token ? (
			                <div style={{ position: 'relative', marginLeft: '4px' }} 
			                    onMouseEnter={() => setShowDropdown(true)} 
			                    onMouseLeave={() => setShowDropdown(false)}>
			                    <div style={{ 
			                        display: 'flex', alignItems: 'center', gap: '8px', 
			                        padding: '6px 12px', borderRadius: '12px', 
			                        cursor: 'pointer', transition: 'all 0.3s',
			                        background: scrolled ? c.hover : 'rgba(255,255,255,0.1)',
			                    }}>
			                        <div style={{ 
			                            width: '32px', height: '32px', borderRadius: '50%', 
			                            background: darkGradient, color: '#fff', 
			                            display: 'flex', alignItems: 'center', justifyContent: 'center', 
			                            fontWeight: '700', fontSize: '13px' 
			                        }}>{user?.username?.charAt(0).toUpperCase()}</div>
			                        <span style={{ fontSize: '13px', fontWeight: '600', color: scrolled ? c.text : '#fff' }}>{user?.username}</span>
			                        <span style={{ fontSize: '10px', color: scrolled ? c.text2 : 'rgba(255,255,255,0.6)' }}>▼</span>
			                    </div>
			                    {showDropdown && (
			                        <div style={{ 
			                            position: 'absolute', top: '48px', right: 0, 
			                            background: c.card, borderRadius: '14px', 
			                            boxShadow: '0 20px 50px rgba(0,0,0,0.12)', 
			                            padding: '6px', minWidth: '180px', zIndex: 10, 
			                            border: `1px solid ${c.border}`,
			                            animation: 'fadeInUp 0.2s ease'
			                        }}>
			                            <Link to="/profile" style={dd(c)}>👤 My Profile</Link>
			                            <Link to="/orders" style={dd(c)}>📋 My Orders</Link>
			                            {user?.role === 'ADMIN' && <Link to="/admin" style={dd(c)}>📊 Admin Panel</Link>}
			                            <div style={{ borderTop: `1px solid ${c.border}`, margin: '4px 0' }}></div>
			                            <span onClick={handleLogout} style={{...dd(c), color: '#ef4444'}}>🚪 Logout</span>
			                        </div>
			                    )}
			                </div>
			            ) : (
			                <Link to="/login" style={{ 
			                    marginLeft: '8px', padding: '10px 24px', 
			                    background: darkGradient, color: '#fff', 
			                    borderRadius: '12px', textDecoration: 'none', 
			                    fontWeight: '600', fontSize: '13px',
			                    boxShadow: '0 4px 15px rgba(76,29,149,0.3)',
			                    transition: 'all 0.3s ease'
			                }}
			                    onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 25px rgba(76,29,149,0.4)'; }}
			                    onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 15px rgba(76,29,149,0.3)'; }}
			                >Sign In</Link>
			            )}
			        </div>
			    </div>
			</nav>
		{/* STICKY COUPON BAR - Navbar के नीचे */}
			{scrolled && (
			    <div style={{
			        position: 'fixed', top: '64px', left: 0, right: 0, zIndex: 999,
			        background: 'linear-gradient(160deg, #1a0a2e, #2d1b4e, #4c1d95)',
			        color: '#fff', textAlign: 'center', padding: '10px 20px',
			        fontSize: '13px', fontWeight: '500',
			        animation: 'fadeInUp 0.4s ease',
			        display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', flexWrap: 'wrap'
			    }}>
			        <span style={{ opacity: '0.9' }}>🎉 <strong>Limited Time Offer!</strong> Use code</span>
			        <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '6px', fontWeight: '700', letterSpacing: '1px', fontSize: '14px' }}>WELCOME10</span>
			        <span style={{ opacity: '0.9' }}>for <strong>10% OFF</strong> on your first order</span>
			        <Link to="/products" style={{ color: '#fff', fontWeight: '700', fontSize: '12px', textDecoration: 'underline', marginLeft: '5px' }}>Shop Now →</Link>
			        <button onClick={() => setScrolled(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '16px', marginLeft: '10px' }}>✕</button>
			    </div>
			)}

            {/* HERO CAROUSEL */}
            <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
                {slides.map((slide, i) => (
                    <div key={i} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: i === currentSlide ? 1 : 0, transition: 'all 1.2s ease', background: `linear-gradient(135deg, rgba(0,0,0,0.7), rgba(0,0,0,0.5)), url(${slide.image}) center/cover`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ textAlign: 'center', color: '#fff', maxWidth: '700px', padding: '0 40px' }}>
                            <span style={{ display: 'inline-block', padding: '8px 20px', background: 'rgba(255,255,255,0.1)', borderRadius: '25px', fontSize: '12px', fontWeight: '700', letterSpacing: '3px', marginBottom: '30px', textTransform: 'uppercase', border: '1px solid rgba(255,255,255,0.2)' }}>{slide.tag}</span>
                            <h1 style={{ fontSize: '60px', fontWeight: '800', letterSpacing: '-1px', marginBottom: '18px', lineHeight: '1.1' }}>{slide.title}</h1>
                            <p style={{ fontSize: '18px', opacity: '0.85', marginBottom: '40px' }}>{slide.subtitle}</p>
                            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                                <Link to="/products" style={{ padding: '16px 36px', background: '#fff', color: '#0a0a0a', borderRadius: '14px', textDecoration: 'none', fontWeight: '700', fontSize: '15px' }}>{slide.cta}</Link>
                                <Link to="/products" style={{ padding: '16px 36px', background: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '14px', textDecoration: 'none', fontWeight: '600', fontSize: '15px', border: '2px solid rgba(255,255,255,0.3)' }}>{slide.secondaryCta}</Link>
                            </div>
                        </div>
                    </div>
                ))}
                <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px' }}>
                    {slides.map((_, i) => <button key={i} onClick={() => setCurrentSlide(i)} style={{ width: i === currentSlide ? '36px' : '10px', height: '10px', borderRadius: '5px', border: 'none', cursor: 'pointer', background: i === currentSlide ? '#fff' : 'rgba(255,255,255,0.4)', transition: 'all 0.4s' }}></button>)}
                </div>
            </div>

           
			{/* CATEGORIES */}
			<div style={{ maxWidth: '1300px', margin: '80px auto', padding: '0 30px' }}>
			    <div style={{ textAlign: 'center', marginBottom: '50px' }}>
			        <span style={{ fontSize: '12px', fontWeight: '700', color: c.primary, letterSpacing: '3px', textTransform: 'uppercase' }}>Categories</span>
			        <h2 style={{ fontSize: '38px', fontWeight: '800', color: c.text, margin: '10px 0' }}>Shop by Category</h2>
			        <p style={{ color: c.text2, fontSize: '14px', maxWidth: '500px', margin: '10px auto 0' }}>Explore our wide range of categories and find exactly what you need</p>
			    </div>
			    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '20px' }}>
			        {categories.map((cat, i) => (
			            <Link to={`/products?category=${cat.name}`} key={i} style={{ textDecoration: 'none' }}>
			                <div style={{ position: 'relative', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.3s' }}
			                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-6px)'}
			                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
			                    <div style={{ borderRadius: '20px', overflow: 'hidden', aspectRatio: '1', marginBottom: '12px', border: `2px solid ${c.border}`, position: 'relative' }}>
			                        <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
			                        {/* HOVER OVERLAY */}
			                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(76,29,149,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.3s' }}
			                            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
			                            onMouseLeave={e => e.currentTarget.style.opacity = '0'}>
			                            <span style={{ color: '#fff', fontWeight: '700', fontSize: '14px', background: 'rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: '8px', backdropFilter: 'blur(10px)' }}>Explore →</span>
			                        </div>
			                    </div>
			                    <p style={{ fontSize: '15px', fontWeight: '600', color: c.text }}>{cat.name}</p>
			                    <p style={{ fontSize: '12px', color: c.text2, marginTop: '2px' }}>
			                        {cat.name === 'Smartphones' ? '120+ Products' : 
			                         cat.name === 'Laptops' ? '85+ Products' : 
			                         cat.name === 'Audio' ? '200+ Products' : 
			                         cat.name === 'Wearables' ? '55+ Products' : 
			                         cat.name === 'Fashion' ? '300+ Products' : '95+ Products'}
			                    </p>
			                </div>
			            </Link>
			        ))}
			    </div>
			</div>

            {/* FEATURED PRODUCTS */}
			{/* FEATURED PRODUCTS */}
			<div style={{ maxWidth: '1300px', margin: '0 auto 80px', padding: '0 30px' }}>
			    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '45px' }}>
			        <div>
			            <span style={{ fontSize: '12px', fontWeight: '700', color: c.primary, letterSpacing: '3px', textTransform: 'uppercase' }}>Featured</span>
			            <h2 style={{ fontSize: '34px', fontWeight: '800', color: c.text, marginTop: '8px' }}>Trending Now</h2>
			        </div>
			        <div style={{ display: 'flex', gap: '10px' }}>
			            <button style={{ padding: '10px 20px', background: c.primary, color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>All</button>
			            <button style={{ padding: '10px 20px', background: c.card, color: c.text, border: `1px solid ${c.border}`, borderRadius: '10px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>New</button>
			            <button style={{ padding: '10px 20px', background: c.card, color: c.text, border: `1px solid ${c.border}`, borderRadius: '10px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>Popular</button>
			        </div>
			        <Link to="/products" style={{ padding: '12px 28px', background: c.card, color: c.primary, border: `2px solid ${c.border}`, borderRadius: '12px', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>View All →</Link>
			    </div>
			    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '25px' }}>
			        {products.map((p, idx) => (
			            <Link to={`/product/${p.id}`} key={p.id} style={{ textDecoration: 'none' }}>
			                <div style={{ background: c.card, borderRadius: '20px', overflow: 'hidden', border: `1px solid ${c.border}`, transition: 'all 0.4s', cursor: 'pointer', position: 'relative' }}
			                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 25px 60px rgba(0,0,0,0.1)'; }}
			                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
			                    
			                    {/* NEW BADGE */}
			                    {idx < 2 && (
			                        <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 2, background: '#10b981', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>New</div>
			                    )}
			                    
			                    {/* SALE BADGE */}
			                    {idx >= 2 && idx < 4 && (
			                        <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 2, background: '#ef4444', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Sale</div>
			                    )}
			                    
			                    {/* WISHLIST ICON */}
			                    <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 2, width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', cursor: 'pointer', backdropFilter: 'blur(10px)' }}>🤍</div>
			                    
			                    <div style={{ height: '250px', overflow: 'hidden', background: c.bg2 }}>
			                        <img src={p.imageUrl?.startsWith('/uploads') ? `http://localhost:8080${p.imageUrl}` : getImage(p.category)} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s' }} />
			                    </div>
			                    
			                    {/* QUICK VIEW OVERLAY */}
			                    <div style={{ position: 'absolute', bottom: '80px', left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: 0, transition: 'opacity 0.3s' }}
			                        onMouseEnter={e => e.currentTarget.style.opacity = '1'}
			                        onMouseLeave={e => e.currentTarget.style.opacity = '0'}>
			                        <span style={{ background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '8px 20px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', backdropFilter: 'blur(10px)' }}>Quick View</span>
			                    </div>
			                    
			                    <div style={{ padding: '20px' }}>
			                        <span style={{ fontSize: '10px', fontWeight: '700', color: c.primary, textTransform: 'uppercase', letterSpacing: '1px' }}>{p.category}</span>
			                        <h4 style={{ fontSize: '16px', fontWeight: '600', color: c.text, margin: '8px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</h4>
			                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
			                            <span style={{ fontSize: '11px', color: '#f59e0b' }}>★★★★★</span>
			                            <span style={{ fontSize: '11px', color: c.text2 }}>(4.8)</span>
			                        </div>
			                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
			                            <div>
			                                <span style={{ fontSize: '20px', fontWeight: '700', color: c.text }}>₹{Number(p.price).toLocaleString()}</span>
			                                <span style={{ fontSize: '12px', color: c.text2, textDecoration: 'line-through', marginLeft: '8px' }}>₹{Number(p.price * 1.4).toLocaleString()}</span>
			                            </div>
			                            <span style={{ fontSize: '11px', fontWeight: '600', color: '#059669', background: '#ecfdf5', padding: '3px 8px', borderRadius: '4px' }}>29% off</span>
			                        </div>
			                    </div>
			                </div>
			            </Link>
			        ))}
			    </div>
			</div>

            {/* DISCOUNT BANNER */}
            <div style={{ maxWidth: '1300px', margin: '0 auto 80px', padding: '0 30px' }}>
                <div style={{ background: 'linear-gradient(160deg, #1a0a2e 0%, #2d1b4e 50%, #4c1d95 100%)', borderRadius: '24px', padding: '50px 50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 20px 50px rgba(26,10,46,0.4)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', width: '350px', height: '350px', borderRadius: '50%', background: 'rgba(167,139,250,0.06)', top: '-20%', right: '-10%' }}></div>
                    <div style={{ position: 'absolute', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(167,139,250,0.04)', bottom: '-15%', left: '-5%' }}></div>
                    <div style={{ position: 'relative', zIndex: 1, color: '#fff', flex: 1 }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', background: 'rgba(167,139,250,0.2)', padding: '6px 16px', borderRadius: '20px' }}>Limited Time Offer</span>
                        <h2 style={{ fontSize: '36px', fontWeight: '800', margin: '15px 0 10px' }}>Get 10% Off Your First Order</h2>
                        <p style={{ fontSize: '16px', opacity: '0.9' }}>Use code <strong style={{ background: 'rgba(167,139,250,0.3)', padding: '4px 14px', borderRadius: '6px', fontSize: '18px', letterSpacing: '1px' }}>WELCOME10</strong> at checkout</p>
                    </div>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <Link to="/products" style={{ padding: '16px 36px', background: '#fff', color: '#4c1d95', borderRadius: '14px', textDecoration: 'none', fontWeight: '700', fontSize: '16px', display: 'inline-block', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>Shop Now →</Link>
                    </div>
                </div>
            </div>

            {/* WHY SHOP WITH US */}
			{/* WHY SHOP WITH US */}
			<div style={{ maxWidth: '1300px', margin: '80px auto', padding: '0 30px' }}>
			    <div style={{ textAlign: 'center', marginBottom: '50px' }}>
			        <span style={{ fontSize: '12px', fontWeight: '700', color: c.primary, letterSpacing: '3px', textTransform: 'uppercase' }}>Our Promise</span>
			        <h2 style={{ fontSize: '34px', fontWeight: '800', color: c.text, margin: '10px 0' }}>Why Shop With Us</h2>
			        <p style={{ color: c.text2, fontSize: '14px', maxWidth: '500px', margin: '10px auto 0' }}>We are committed to providing you with the best shopping experience</p>
			    </div>
			    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px' }}>
			        {[
			            { icon: '💎', title: 'Premium Quality', desc: 'Every product is handpicked and goes through rigorous quality checks. We source only from trusted suppliers.' },
			            { icon: '💰', title: 'Best Prices', desc: 'We offer competitive prices with regular discounts, exclusive deals, and price match guarantee.' },
			            { icon: '🚀', title: 'Fast Delivery', desc: 'Express shipping available. Most orders are delivered within 2-3 business days. Free shipping on orders above ₹999.' },
			        ].map(item => (
			            <div key={item.title} style={{ background: c.card, borderRadius: '20px', border: `1px solid ${c.border}`, padding: '40px 30px', textAlign: 'center', transition: 'all 0.3s' }}
			                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.1)'; }}
			                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
			                <div style={{ fontSize: '40px', marginBottom: '15px' }}>{item.icon}</div>
			                <h3 style={{ fontSize: '20px', fontWeight: '700', color: c.text, marginBottom: '12px' }}>{item.title}</h3>
			                <p style={{ fontSize: '14px', color: c.text2, lineHeight: '1.7' }}>{item.desc}</p>
			            </div>
			        ))}
			    </div>
			</div>

            {/* TESTIMONIALS */}
			{/* TESTIMONIALS */}
			<div style={{ 
			    background: 'linear-gradient(160deg, #1a0a2e 0%, #2d1b4e 40%, #3d1f6d 70%, #4c1d95 100%)', 
			    padding: '100px 30px', 
			    color: '#fff', 
			    position: 'relative', 
			    overflow: 'hidden' 
			}}>
			    {/* Floating blobs - subtle */}
			    <div style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.08), transparent 70%)', top: '-15%', right: '-10%', filter: 'blur(60px)' }}></div>
			    <div style={{ position: 'absolute', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.05), transparent 70%)', bottom: '-10%', left: '-5%', filter: 'blur(50px)' }}></div>
			    
			    <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
			        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
			            <span style={{ fontSize: '12px', fontWeight: '700', color: '#c4b5fd', letterSpacing: '3px', textTransform: 'uppercase' }}>Testimonials</span>
			            <h2 style={{ fontSize: '36px', fontWeight: '800', margin: '15px 0 10px', color: '#ffffff' }}>What Our Customers Say</h2>
			            <p style={{ color: '#c4b5fd', fontSize: '14px', opacity: '0.8' }}>Join thousands of happy customers who trust e-shop</p>
			        </div>

			        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px' }}>
			            {[
			                { name: 'Priya Sharma', role: 'Verified Buyer', text: 'Exceptional quality and lightning-fast delivery. The packaging was premium and the product exceeded my expectations.', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face', rating: 5 },
			                { name: 'Rahul Mehta', role: 'Premium Member', text: 'Best online shopping experience I have ever had. The curated collections are absolutely stunning.', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', rating: 5 },
			                { name: 'Ananya Patel', role: 'Regular Customer', text: 'Outstanding customer service and product quality. I recommend e-shop to everyone.', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', rating: 5 },
			                { name: 'Vikram Singh', role: 'Verified Buyer', text: 'The product quality is amazing. I ordered a laptop and it arrived in perfect condition.', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', rating: 5 },
			                { name: 'Neha Gupta', role: 'Premium Member', text: 'Love the exclusive deals! Got my favorite headphones at an amazing price.', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face', rating: 4 },
			                { name: 'Arjun Kapoor', role: 'Regular Customer', text: 'Fast shipping and excellent packaging. The return process was also very smooth.', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', rating: 5 },
			            ].map((t, i) => (
			                <div key={i} style={{ 
			                    background: 'rgba(255,255,255,0.04)', 
			                    borderRadius: '20px', 
			                    padding: '30px', 
			                    border: '1px solid rgba(255,255,255,0.08)', 
			                    backdropFilter: 'blur(10px)', 
			                    transition: 'all 0.3s' 
			                }}
			                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
			                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}>
			                    <div style={{ fontSize: '40px', marginBottom: '10px', opacity: '0.2', lineHeight: '1', color: '#c4b5fd' }}>"</div>
			                    <p style={{ fontSize: '14px', lineHeight: '1.8', opacity: '0.85', marginBottom: '20px', fontStyle: 'italic', color: '#e9d5ff' }}>{t.text}</p>
			                    <div style={{ color: '#fbbf24', fontSize: '14px', marginBottom: '20px' }}>{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</div>
			                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px' }}>
			                        <img src={t.photo} alt={t.name} style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(196,181,253,0.5)' }} />
			                        <div>
			                            <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '2px', color: '#ffffff' }}>{t.name}</h4>
			                            <p style={{ fontSize: '11px', opacity: '0.7', color: '#c4b5fd' }}>{t.role}</p>
			                        </div>
			                        <div style={{ marginLeft: 'auto', width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
			                            <span style={{ color: '#10b981', fontSize: '14px' }}>✓</span>
			                        </div>
			                    </div>
			                </div>
			            ))}
			        </div>

			        {/* Stats Bar */}
			        <div style={{ display: 'flex', justifyContent: 'center', gap: '60px', marginTop: '50px', padding: '30px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
			            {[
			                { value: '10K+', label: 'Happy Customers' },
			                { value: '4.9/5', label: 'Average Rating' },
			                { value: '50K+', label: 'Orders Delivered' },
			                { value: '98%', label: 'Satisfaction Rate' },
			            ].map(stat => (
			                <div key={stat.label} style={{ textAlign: 'center' }}>
			                    <div style={{ fontSize: '28px', fontWeight: '800', color: 'white', marginBottom: '4px' }}>{stat.value}</div>
			                    <div style={{ fontSize: '12px', opacity: '0.7', color: '#e9d5ff' }}>{stat.label}</div>
			                </div>
			            ))}
			        </div>
			    </div>
			</div>
            {/* FOOTER */}
            <footer style={{ background: '#0a0a0a', color: '#e9d5ff', padding: '70px 30px 30px', marginTop: '60px' }}>
                <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 1.5fr', gap: '50px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(160deg, #1a0a2e, #2d1b4e, #4c1d95)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800', fontSize: '20px' }}>E</div>
                            <span style={{ fontSize: '24px', fontWeight: '800', color: '#fff', letterSpacing: '-0.5px' }}>e-shop</span>
                        </div>
                        <p style={{ fontSize: '13px', opacity: '0.7', lineHeight: '1.8', maxWidth: '320px', marginBottom: '20px' }}>Your premium shopping destination for curated electronics, fashion, and lifestyle products. Quality guaranteed with every purchase.</p>
                    </div>
                    <div>
                        <h4 style={{ color: '#fff', fontSize: '14px', fontWeight: '700', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>Quick Links</h4>
                        {['About Us', 'Contact Us', 'FAQ', 'Blog', 'Careers'].map(l => <p key={l} style={{ fontSize: '13px', margin: '10px 0', cursor: 'pointer', opacity: '0.7' }}>{l}</p>)}
                    </div>
                    <div>
                        <h4 style={{ color: '#fff', fontSize: '14px', fontWeight: '700', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>Customer Service</h4>
                        {['Help Center', 'Returns Policy', 'Shipping Info', 'Track Order', 'Size Guide'].map(l => <p key={l} style={{ fontSize: '13px', margin: '10px 0', cursor: 'pointer', opacity: '0.7' }}>{l}</p>)}
                    </div>
                    <div>
                        <h4 style={{ color: '#fff', fontSize: '14px', fontWeight: '700', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>Stay Connected</h4>
                        <form onSubmit={handleNewsletter} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                            <input type="email" placeholder="Your email address" value={newsletterEmail} onChange={e => setNewsletterEmail(e.target.value)} required
                                style={{ flex: 1, padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '13px', fontFamily: "'Inter', sans-serif", outline: 'none' }} />
                            <button type="submit" style={{ padding: '12px 20px', background: darkGradient, color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', fontSize: '13px', fontFamily: "'Inter', sans-serif", whiteSpace: 'nowrap' }}>Subscribe</button>
                        </form>
                        <div style={{ fontSize: '13px', opacity: '0.7', lineHeight: '2' }}>
                            <p>📧 support@eshop.com</p>
                            <p>📞 1800-123-4567</p>
                            <p>📍 Mumbai, India</p>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '50px', marginTop: '40px', padding: '20px 0', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    {['Secure Checkout', 'SSL Encrypted', 'Free Shipping', 'Easy Returns', 'Quality Guarantee'].map(b => <span key={b} style={{ fontSize: '12px', opacity: '0.8' }}>{b}</span>)}
                </div>
                <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', opacity: '0.5', flexWrap: 'wrap', gap: '10px' }}>
                    <span>© 2026 e-shop. All rights reserved.</span>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(l => <span key={l} style={{ cursor: 'pointer' }}>{l}</span>)}
                    </div>
                    <span>Made with love in India</span>
                </div>
            </footer>

            {/* BACK TO TOP */}
            {showBackToTop && (
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 999, width: '46px', height: '46px', borderRadius: '50%', background: darkGradient, color: '#fff', border: 'none', cursor: 'pointer', fontSize: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
                    ↑
                </button>
            )}
        </div>
    );
}

const dd = (c) => ({ display: 'block', padding: '10px 16px', borderRadius: '10px', color: c.text, textDecoration: 'none', fontSize: '13px', fontWeight: '600' });

export default HomePage;