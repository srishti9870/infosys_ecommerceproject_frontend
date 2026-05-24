import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export default function Button({ children, variant = 'primary', size = 'md', fullWidth, loading, icon, ...props }) {
    const theme = useTheme();
    const t = theme?.colors || {};

    const variants = {
        primary: { bg: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', border: 'none' },
        secondary: { bg: 'rgba(99,102,241,0.1)', color: t.primary || '#6366f1', border: 'none' },
        outline: { bg: 'transparent', color: t.primary || '#6366f1', border: '2px solid #6366f1' },
        ghost: { bg: 'transparent', color: t.text2 || '#6b7280', border: 'none' },
        danger: { bg: '#ef4444', color: '#fff', border: 'none' },
    };

    const sizes = {
        sm: { padding: '8px 16px', fontSize: '13px' },
        md: { padding: '12px 24px', fontSize: '14px' },
        lg: { padding: '16px 32px', fontSize: '16px' },
    };

    const v = variants[variant] || variants.primary;
    const s = sizes[size] || sizes.md;

    return (
        <button {...props} style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: s.padding, fontSize: s.fontSize, fontWeight: '600',
            color: v.color, background: v.bg, border: v.border,
            borderRadius: '12px', cursor: props.disabled ? 'not-allowed' : 'pointer',
            opacity: props.disabled ? 0.6 : 1,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            width: fullWidth ? '100%' : 'auto',
            fontFamily: "'Inter', sans-serif",
            letterSpacing: '0.3px',
            boxShadow: variant === 'primary' ? '0 4px 15px rgba(99,102,241,0.3)' : 'none',
            ...props.style,
        }}>
            {loading ? '⏳' : icon} {children}
        </button>
    );
}