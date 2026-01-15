import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useRetention } from '../app/context/RetentionContext';
import { STANDING } from '../core/governance/StandingSystem';

const StandingGuard = ({ children }) => {
    const { standing, loading } = useRetention();
    const location = useLocation();

    if (loading) {
        return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Accessing Authority...</div>;
    }

    const isBreached = standing === STANDING.BREACHED;
    const isOnBreachPage = location.pathname === '/breach-protocol';

    // 1. If Breached, FORCE to breach page
    // (Unless already there)
    if (isBreached && !isOnBreachPage) {
        return <Navigate to="/breach-protocol" replace />;
    }

    // 2. If NOT Breached, BLOCK breach page
    if (!isBreached && isOnBreachPage) {
        return <Navigate to="/" replace />;
    }

    // 3. Allow Access
    return children;
};

export default StandingGuard;
