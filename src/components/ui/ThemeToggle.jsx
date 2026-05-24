import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle() {
    const theme = useTheme();
    const c = theme.colors;

    return (
        <button
            onClick={theme.toggleTheme}
            aria-label="Toggle theme"
            style={{
                position: 'relative',
                width: '52px',
                height: '28px',
                borderRadius: '14px',
                border: `2px solid ${c.border}`,
                background: c.toggleBg,
                cursor: 'pointer',
                padding: '0',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                outline: 'none',
                boxShadow: `0 2px 8px rgba(0,0,0,0.1)`,
            }}
        >
            {/* Toggle Dot */}
            <span style={{
                position: 'absolute',
                top: '3px',
                left: theme.isDark ? '26px' : '3px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: c.toggleDot,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
            }}>
                {theme.isDark ? '☀️' : '🌙'}
            </span>
        </button>
    );
}