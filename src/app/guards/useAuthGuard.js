import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSession } from '../context';

export const useAuthGuard = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Consume Session State
    const {
        onboardingCompleted,
        userType,
        currentUser,
        isLoading,
        appMode
    } = useSession();

    useEffect(() => {
        // 0. Safety Check
        if (!appMode) {
            navigate('/welcome');
            return;
        }

        // 1. Loading State
        if (isLoading) return;

        // 2. Auth Check (Live Mode)
        if (!currentUser && appMode === 'live') {
            navigate('/auth');
        }

        // 3. Onboarding Check
        else if (!onboardingCompleted && userType !== 'super_admin' && appMode === 'live') {
            navigate('/onboarding');
        }

        // 4. Role-Based Access Control
        else if (userType !== 'gym' && userType !== 'gym_owner' && location.pathname.startsWith('/partner') && userType !== 'super_admin') {
            navigate('/');
        } else if ((userType === 'gym' || userType === 'gym_owner') && (location.pathname === '/' || location.pathname === '/home')) {
            navigate('/partner');
        } else if (location.pathname === '/admin' && userType !== 'super_admin') {
            navigate('/');
        }
    }, [currentUser, onboardingCompleted, userType, navigate, location.pathname, isLoading, appMode]);

    return { isLoading };
};
