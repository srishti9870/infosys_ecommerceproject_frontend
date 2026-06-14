import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Landing from './components/Landing';
import Login from './components/Login';
import Register from './components/Register';
import HomePage from './components/HomePage';
import AdminPanel from './components/AdminPanel';
import ProductDetail from './components/ProductDetail';
import CartPage from './components/CartPage';
import OrderSuccess from './components/OrderSuccess';
import CheckoutPage from './components/CheckoutPage';
import OrdersPage from './components/OrdersPage';
import ProfilePage from './components/ProfilePage';
import WishlistPage from './components/WishlistPage';
import ForgotPassword from './components/ForgotPassword';
import ProductList from './components/ProductList';

function App() {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/admin" element={<AdminPanel />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
					<Route path="/cart" element={<CartPage />} />
					<Route path="/order-success" element={<OrderSuccess />} />
					<Route path="/checkout" element={<CheckoutPage />} />
					<Route path="/orders" element={<OrdersPage />} />
					<Route path="/profile" element={<ProfilePage />} />
					<Route path="/wishlist" element={<WishlistPage />} />
					<Route path="/forgot-password" element={<ForgotPassword />} />
					<Route path="/products" element={<ProductList />} />

                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;