import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    // Local storage se saved theme load karo
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved === 'dark';
    });

    // Theme change hone pe local storage update + body class
    useEffect(() => {
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        document.body.style.transition = 'background 0.5s ease, color 0.5s ease';
        document.body.style.background = isDark ? '#0f0a1a' : '#faf8ff';
        document.body.style.color = isDark ? '#f3e8ff' : '#1a0a2e';
    }, [isDark]);

    const toggleTheme = () => setIsDark(prev => !prev);

    const theme = {
        isDark,
        toggleTheme,
        colors: isDark ? {
            primary: '#a78bfa',
            primaryDark: '#7c3aed',
            secondary: '#8b5cf6',
            accent: '#c4b5fd',
            success: '#34d399',
            warning: '#fbbf24',
            danger: '#f87171',
            bg: '#0f0a1a',
            bg2: '#1a1025',
            surface: '#1a1025',
            card: '#1a1025',
            text: '#f3e8ff',
            text2: '#a78bfa',
            border: '#2d1f3a',
            nav: 'rgba(15,10,26,0.95)',
            input: '#1a1025',
            hover: '#2d1f3a',
            shadow: '0 10px 40px rgba(0,0,0,0.3)',
            toggleBg: '#2d1f3a',
            toggleDot: '#a78bfa',
        } : {
            primary: '#7c3aed',
            primaryDark: '#6d28d9',
            secondary: '#8b5cf6',
            accent: '#a78bfa',
            success: '#10b981',
            warning: '#f59e0b',
            danger: '#ef4444',
            bg: '#faf8ff',
            bg2: '#f3e8ff',
            surface: '#ffffff',
            card: '#ffffff',
            text: '#1a0a2e',
            text2: '#6b7280',
            border: '#e9d5ff',
            nav: 'rgba(255,255,255,0.97)',
            input: '#faf8ff',
            hover: '#f5f0ff',
            shadow: '0 10px 40px rgba(76,29,149,0.08)',
            toggleBg: '#e9d5ff',
            toggleDot: '#7c3aed',
        }
    };

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}