import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [darkMode, setDarkMode] = useState(false);

    const toggleTheme = () => setDarkMode(!darkMode);

    const theme = {
        darkMode,
        toggleTheme,
        colors: darkMode ? {
            bg: '#1a1a2e',
            bg2: '#16213e',
            card: '#0f3460',
            text: '#ffffff',
            text2: '#e0e0e0',
            primary: '#7c5cbf',
            primary2: '#a78bfa',
            border: '#333',
            nav: '#16213e'
        } : {
            bg: '#faf8ff',
            bg2: '#f5f0ff',
            card: '#ffffff',
            text: '#2d3436',
            text2: '#636e72',
            primary: '#7c5cbf',
            primary2: '#a78bfa',
            border: '#e8ddff',
            nav: '#ffffff'
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