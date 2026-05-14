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
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;