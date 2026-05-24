import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts, getCurrentUser, logoutUser, getToken } from '../services/api';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ui/ThemeToggle';

const API_URL = 'http://localhost:8080/api';

function HomePage() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [testimonialIndex, setTestimonialIndex] = useState(0);
    const [cartCount, setCartCount] = useState(0);
    const user = getCurrentUser();
    const token = getToken();
	const theme = useTheme();
	const c = theme.colors;

	

    const slides = [
        {
            tag: 'New Collection 2026',
            title: 'Elevate Your Lifestyle',
            subtitle: 'Discover premium products curated for the modern you',
            image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=80',
            cta: 'Explore Collection',
            secondaryCta: 'View Deals'
        },
        {
            tag: 'Exclusive Offer',
            title: 'Up to 40% Off',
            subtitle: 'Limited time deals on top brands and premium items',
            image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&q=80',
            cta: 'Shop Sale',
            secondaryCta: 'Learn More'
        },
        {
            tag: 'Free Shipping',
            title: 'Delivered to Your Door',
            subtitle: 'Free express delivery on all orders above ₹999',
            image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400&q=80',
            cta: 'Start Shopping',
            secondaryCta: 'See Details'
        },
    ];

    const testimonials = [
        { name: 'Priya Sharma', role: 'Verified Buyer', text: 'Exceptional quality and lightning-fast delivery. The packaging was premium and the product exceeded my expectations.' },
        { name: 'Rahul Mehta', role: 'Premium Member', text: 'Best online shopping experience I have ever had. The curated collections are absolutely stunning.' },
        { name: 'Ananya Patel', role: 'Regular Customer', text: 'Outstanding customer service and product quality. I recommend e-shop to everyone I know.' },
    ];

    const categories = [
        { name: 'Smartphones', image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=80', count: '120+ Products' },
        { name: 'Laptops', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80', count: '85+ Products' },
        { name: 'Audio', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80', count: '200+ Products' },
        { name: 'Wearables', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80', count: '55+ Products' },
        { name: 'Fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80', count: '300+ Products' },
        { name: 'Sports', image: 'https://images.unsplash.com/photo-1461896836934-bd45ba4fcf69?w=400&q=80', count: '95+ Products' },
    ];

    useEffect(() => {
        loadProducts();
        const slideInterval = setInterval(() => setCurrentSlide(prev => (prev + 1) % slides.length), 5000);
        const testimonialInterval = setInterval(() => setTestimonialIndex(prev => (prev + 1) % testimonials.length), 4000);
        window.addEventListener('scroll', () => setScrolled(window.scrollY > 60));
        return () => { clearInterval(slideInterval); clearInterval(testimonialInterval); };
    }, []);

    const loadProducts = async () => {
        try {
            const res = await axios.get(`${API_URL}/products?page=0&size=8`);
            const data = res.data.products || res.data || [];
            setProducts(Array.isArray(data) ? data.slice(0, 8) : []);
        } catch (err) {}
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) navigate(`/products?search=${searchQuery}`);
    };

    const handleLogout = () => { logoutUser(); navigate('/login'); };

    const getImage = (cat) => {
        const imgs = {
            'Smartphones': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80',
            'Electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=80',
            'Laptops': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80',
            'Fashion': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&q=80',
            'Sports': 'https://images.unsplash.com/photo-1461896836934-bd45ba4fcf69?w=500&q=80',
            'Beauty': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc8?w=500&q=80',
            'Home': 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=500&q=80',
        };
        return imgs[cat] || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=500&q=80';
    };

    return (
        <div style={{ background: '#faf8ff', fontFamily: "'Inter', sans-serif", overflow: 'hidden' }}>

            {/* NAVBAR */}
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
                padding: scrolled ? '8px 0' : '16px 0',
                background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent',
                backdropFilter: scrolled ? 'blur(20px)' : 'none',
                boxShadow: scrolled ? '0 4px 30px rgba(76,29,149,0.08)' : 'none',
                borderBottom: scrolled ? '1px solid #e9d5ff' : '1px solid transparent',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    
                    <Link to="/home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '18px', boxShadow: '0 8px 25px rgba(76,29,149,0.3)' }}>E</div>
                        <span style={{ fontSize: '22px', fontWeight: '800', color: scrolled ? '#1a0a2e' : '#fff', letterSpacing: '-0.5px', transition: 'color 0.3s' }}>e-shop</span>
                    </Link>

                    <form onSubmit={handleSearch} style={{ flex: '0 1 580px', position: 'relative' }}>
                        <input type="text" placeholder="Search for products, brands and more..." value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%', padding: '13px 52px 13px 20px', borderRadius: '14px',
                                border: `2px solid ${scrolled ? '#e9d5ff' : 'rgba(255,255,255,0.3)'}`,
                                outline: 'none', fontSize: '14px', fontFamily: "'Inter', sans-serif",
                                background: scrolled ? '#faf8ff' : 'rgba(255,255,255,0.15)',
                                color: scrolled ? '#1a0a2e' : '#fff', transition: 'all 0.3s',
                                boxSizing: 'border-box', backdropFilter: 'blur(10px)'
                            }}
                            onFocus={e => { e.target.style.borderColor = '#7c3aed'; e.target.style.background = '#fff'; e.target.style.color = '#1a0a2e'; }}
                            onBlur={e => { e.target.style.borderColor = scrolled ? '#e9d5ff' : 'rgba(255,255,255,0.3)'; e.target.style.background = scrolled ? '#faf8ff' : 'rgba(255,255,255,0.15)'; e.target.style.color = scrolled ? '#1a0a2e' : '#fff'; }}
                        />
                        <button type="submit" style={{ position: 'absolute', right: '4px', top: '4px', bottom: '4px', width: '44px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', color: '#fff', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s' }}
                            onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                        >⌕</button>
                    </form>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
					
						<ThemeToggle />
						
                        {['Home', 'Wishlist', 'Orders', 'Cart'].map(l => (
                            <Link key={l} to={`/${l.toLowerCase() === 'home' ? 'home' : l.toLowerCase()}`} style={{
                                color: scrolled ? '#6b7280' : 'rgba(255,255,255,0.85)', textDecoration: 'none',
                                fontWeight: '500', fontSize: '13px', padding: '9px 15px', borderRadius: '10px',
                                transition: 'all 0.25s',
                            }}
                                onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.1)'; e.target.style.color = '#fff'; }}
                                onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = scrolled ? '#6b7280' : 'rgba(255,255,255,0.85)'; }}
                            >{l}</Link>
                        ))}
                        {token ? (
                            <div style={{ position: 'relative', marginLeft: '8px' }} onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}>
                                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(76,29,149,0.3)', transition: 'transform 0.2s' }}
                                    onMouseEnter={e => e.target.style.transform = 'scale(1.08)'}
                                    onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                                >{user?.username?.charAt(0).toUpperCase()}</div>
                                {showDropdown && (
                                    <div style={{ position: 'absolute', top: '50px', right: 0, background: '#fff', borderRadius: '14px', boxShadow: '0 20px 60px rgba(76,29,149,0.2)', padding: '8px', minWidth: '170px', zIndex: 10, border: '1px solid #e9d5ff' }}>
                                        <Link to="/profile" style={dd}>👤 Profile</Link>
                                        <Link to="/orders" style={dd}>📋 Orders</Link>
                                        {user?.role === 'ADMIN' && <Link to="/admin" style={dd}>📊 Admin Panel</Link>}
                                        <div style={{ borderTop: '1px solid #e9d5ff', margin: '4px 0' }}></div>
                                        <span onClick={handleLogout} style={{...dd, color: '#dc2626'}}>🚪 Logout</span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" style={{ marginLeft: '8px', padding: '10px 22px', background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', color: '#fff', borderRadius: '12px', textDecoration: 'none', fontWeight: '600', fontSize: '13px', boxShadow: '0 6px 20px rgba(76,29,149,0.3)', transition: 'all 0.3s' }}
                                onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 10px 30px rgba(76,29,149,0.4)'; }}
                                onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 6px 20px rgba(76,29,149,0.3)'; }}
                            >Sign In</Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* HERO CAROUSEL */}
            <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
                {slides.map((slide, i) => (
                    <div key={i} style={{
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                        opacity: i === currentSlide ? 1 : 0,
                        transform: i === currentSlide ? 'scale(1)' : 'scale(1.05)',
                        transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        background: `linear-gradient(135deg, rgba(15,10,26,0.75), rgba(45,27,78,0.6)), url(${slide.image}) center/cover no-repeat`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <div style={{ textAlign: 'center', color: '#fff', maxWidth: '750px', padding: '0 40px', animation: i === currentSlide ? 'fadeInUp 0.8s ease' : 'none' }}>
                            <span style={{ display: 'inline-block', padding: '8px 20px', background: 'rgba(167,139,250,0.2)', borderRadius: '25px', fontSize: '12px', fontWeight: '700', letterSpacing: '3px', marginBottom: '30px', border: '1px solid rgba(167,139,250,0.3)', textTransform: 'uppercase', backdropFilter: 'blur(10px)' }}>{slide.tag}</span>
                            <h1 style={{ fontSize: '64px', fontWeight: '800', letterSpacing: '-1.5px', marginBottom: '18px', lineHeight: '1.1' }}>{slide.title}</h1>
                            <p style={{ fontSize: '18px', opacity: '0.85', marginBottom: '40px', fontWeight: '400', lineHeight: '1.6' }}>{slide.subtitle}</p>
                            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                                <Link to="/products" style={{ padding: '16px 36px', background: '#fff', color: '#4c1d95', borderRadius: '14px', textDecoration: 'none', fontWeight: '700', fontSize: '15px', transition: 'all 0.3s', boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}
                                    onMouseEnter={e => { e.target.style.transform = 'translateY(-3px)'; e.target.style.boxShadow = '0 15px 40px rgba(0,0,0,0.25)'; }}
                                    onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)'; }}
                                >{slide.cta}</Link>
                                <Link to="/products" style={{ padding: '16px 36px', background: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '14px', textDecoration: 'none', fontWeight: '600', fontSize: '15px', border: '2px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(10px)', transition: 'all 0.3s' }}
                                    onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.2)'; }}
                                    onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.1)'; }}
                                >{slide.secondaryCta}</Link>
                            </div>
                        </div>
                    </div>
                ))}
                
                {/* Slide Controls */}
                <button onClick={() => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length)} style={{ position: 'absolute', left: '30px', top: '50%', transform: 'translateY(-50%)', width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', fontSize: '26px', cursor: 'pointer', backdropFilter: 'blur(10px)', zIndex: 5, transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.3)'}
                    onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.15)'}
                >‹</button>
                <button onClick={() => setCurrentSlide(prev => (prev + 1) % slides.length)} style={{ position: 'absolute', right: '30px', top: '50%', transform: 'translateY(-50%)', width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', fontSize: '26px', cursor: 'pointer', backdropFilter: 'blur(10px)', zIndex: 5, transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.3)'}
                    onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.15)'}
                >›</button>

                <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px', zIndex: 5 }}>
                    {slides.map((_, i) => (
                        <button key={i} onClick={() => setCurrentSlide(i)} style={{
                            width: i === currentSlide ? '36px' : '10px', height: '10px',
                            borderRadius: '5px', border: 'none', cursor: 'pointer',
                            background: i === currentSlide ? '#fff' : 'rgba(255,255,255,0.4)',
                            transition: 'all 0.4s',
                        }}></button>
                    ))}
                </div>
            </div>

            {/* CATEGORIES */}
            <div style={{ maxWidth: '1300px', margin: '80px auto', padding: '0 30px' }}>
                <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#7c3aed', letterSpacing: '3px', textTransform: 'uppercase' }}>Categories</span>
                    <h2 style={{ fontSize: '38px', fontWeight: '800', color: '#1a0a2e', margin: '10px 0', letterSpacing: '-0.5px' }}>Shop by Category</h2>
                    <p style={{ color: '#6b7280', fontSize: '15px' }}>Find exactly what you're looking for</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '20px' }}>
                    {categories.map((cat, i) => (
                        <div key={i} style={{ textAlign: 'center', cursor: 'pointer' }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-6px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                           >
                            <div style={{ borderRadius: '20px', overflow: 'hidden', aspectRatio: '1', marginBottom: '12px', border: '2px solid #e9d5ff', boxShadow: '0 10px 30px rgba(76,29,149,0.06)', transition: 'all 0.3s' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#7c3aed'; e.currentTarget.style.boxShadow = '0 20px 50px rgba(76,29,149,0.15)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e9d5ff'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(76,29,149,0.06)'; }}>
                                <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <p style={{ fontSize: '15px', fontWeight: '600', color: '#4c1d95', marginBottom: '3px' }}>{cat.name}</p>
                            <p style={{ fontSize: '12px', color: '#a78bfa' }}>{cat.count}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* FEATURED PRODUCTS */}
            <div style={{ maxWidth: '1300px', margin: '0 auto 80px', padding: '0 30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '45px' }}>
                    <div>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#7c3aed', letterSpacing: '3px', textTransform: 'uppercase' }}>Featured</span>
                        <h2 style={{ fontSize: '34px', fontWeight: '800', color: '#1a0a2e', marginTop: '8px' }}>Trending Now</h2>
                    </div>
                    <Link to="/products" style={{ padding: '12px 28px', background: '#fff', color: '#4c1d95', border: '2px solid #e9d5ff', borderRadius: '12px', textDecoration: 'none', fontWeight: '600', fontSize: '14px', transition: 'all 0.3s' }}
                        onMouseEnter={e => { e.target.style.background = '#4c1d95'; e.target.style.color = '#fff'; e.target.style.borderColor = '#4c1d95'; }}
                        onMouseLeave={e => { e.target.style.background = '#fff'; e.target.style.color = '#4c1d95'; e.target.style.borderColor = '#e9d5ff'; }}
                    >View All →</Link>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '25px' }}>
                    {products.map((p, idx) => (
                        <Link to={`/product/${p.id}`} key={p.id} style={{ textDecoration: 'none' }}>
                            <div style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', border: '1px solid #e9d5ff', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 4px 20px rgba(76,29,149,0.04)', cursor: 'pointer' }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 25px 60px rgba(76,29,149,0.15)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(76,29,149,0.04)'; }}>
                                <div style={{ height: '250px', overflow: 'hidden', background: '#f5f0ff', position: 'relative' }}>
                                    <img src={getImage(p.category)} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s' }} />
                                    {p.stockQuantity <= 5 && p.stockQuantity > 0 && (
                                        <span style={{ position: 'absolute', top: '12px', left: '12px', padding: '5px 12px', background: '#ff9f00', color: '#fff', borderRadius: '8px', fontSize: '11px', fontWeight: '700' }}>Few Left</span>
                                    )}
                                </div>
                                <div style={{ padding: '20px' }}>
                                    <span style={{ fontSize: '10px', fontWeight: '700', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '1px' }}>{p.category}</span>
                                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1a0a2e', margin: '8px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</h4>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                                        <span style={{ fontSize: '20px', fontWeight: '700', color: '#4c1d95' }}>₹{Number(p.price).toLocaleString()}</span>
                                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#059669', background: '#ecfdf5', padding: '4px 10px', borderRadius: '6px' }}>In Stock</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* TESTIMONIALS */}
            <div style={{ background: 'linear-gradient(160deg, #1a0a2e, #2d1b4e, #4c1d95)', padding: '100px 30px', color: '#fff', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(167,139,250,0.08)', top: '-20%', right: '-15%', filter: 'blur(80px)' }}></div>
                <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(167,139,250,0.06)', bottom: '-10%', left: '-10%', filter: 'blur(60px)' }}></div>
                <div style={{ maxWidth: '750px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#a78bfa', letterSpacing: '3px', textTransform: 'uppercase' }}>Testimonials</span>
                    <h2 style={{ fontSize: '36px', fontWeight: '800', margin: '15px 0 50px' }}>What Our Customers Say</h2>
                    <div style={{ minHeight: '180px' }}>
                        <p style={{ fontSize: '18px', lineHeight: '1.9', opacity: '0.9', fontStyle: 'italic', marginBottom: '30px' }}>"{testimonials[testimonialIndex].text}"</p>
                        <h4 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '6px' }}>{testimonials[testimonialIndex].name}</h4>
                        <p style={{ fontSize: '13px', opacity: '0.6', color: '#a78bfa' }}>{testimonials[testimonialIndex].role}</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '40px' }}>
                        {testimonials.map((_, i) => (
                            <div key={i} onClick={() => setTestimonialIndex(i)} style={{ width: i === testimonialIndex ? '30px' : '10px', height: '10px', borderRadius: '5px', background: i === testimonialIndex ? '#fff' : 'rgba(255,255,255,0.3)', cursor: 'pointer', transition: 'all 0.3s' }}></div>
                        ))}
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <footer style={{ background: '#0f0a1a', color: '#e9d5ff', padding: '80px 30px 30px' }}>
                <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '50px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800', fontSize: '18px' }}>E</div>
                            <span style={{ fontSize: '22px', fontWeight: '800', color: '#fff' }}>e-shop</span>
                        </div>
                        <p style={{ fontSize: '13px', opacity: '0.7', lineHeight: '1.8', maxWidth: '300px' }}>Premium shopping destination for curated electronics, fashion, and lifestyle products. Quality guaranteed.</p>
                    </div>
                    {[
                        { title: 'Company', links: ['About Us', 'Careers', 'Press', 'Blog'] },
                        { title: 'Support', links: ['Help Center', 'Returns', 'Shipping Info', 'Contact'] },
                        { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Security'] },
                    ].map((col, i) => (
                        <div key={i}>
                            <h4 style={{ color: '#fff', fontSize: '13px', fontWeight: '700', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>{col.title}</h4>
                            {col.links.map(l => <p key={l} style={{ fontSize: '13px', margin: '10px 0', cursor: 'pointer', opacity: '0.7', transition: 'opacity 0.3s' }}
                                onMouseEnter={e => e.target.style.opacity = '1'}
                                onMouseLeave={e => e.target.style.opacity = '0.7'}
                            >{l}</p>)}
                        </div>
                    ))}
                </div>
                <div style={{ borderTop: '1px solid rgba(233,213,255,0.1)', marginTop: '60px', paddingTop: '30px', textAlign: 'center', fontSize: '12px', opacity: '0.5' }}>
                    © 2026 e-shop. All rights reserved. Made with 💜
                </div>
            </footer>
        </div>
    );
}

const dd = { display: 'block', padding: '10px 16px', borderRadius: '10px', color: '#4c1d95', textDecoration: 'none', fontSize: '13px', fontWeight: '600', transition: 'all 0.2s' };

export default HomePage;