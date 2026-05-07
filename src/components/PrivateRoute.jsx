import React from 'react';
import { getToken } from '../services/api';

const PrivateRoute = ({ children }) => {
    const token = getToken();

    if (!token) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '50px',
                color: '#dc3545'
            }}>
                <h2>Access Denied</h2>
                <p>Please login first to access this page.</p>
            </div>
        );
    }

    return <>{children}</>;
};

export default PrivateRoute;