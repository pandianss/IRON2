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
        // Debug State for visibility
        // console.log("GUARD CHECK:", { isLoading, hasUser: !!currentUser, path: location.pathname });

        // 1. Loading State
        if (isLoading) return;

        // 2. Auth Check
        if (!currentUser) {
            console.warn("GUARD: No User -> Redirecting to /auth");
            navigate('/auth', { replace: true });
            return;
        }

        // 2.5 Session Restoration (If at root)
        // Disabled: Causes revert loop when manually navigating to Home from another page.
        /*
        if (location.pathname === '/' || location.pathname === '/index.html') {
            const lastPath = localStorage.getItem('iron_last_path');
            if (lastPath && lastPath !== '/' && !lastPath.startsWith('/auth') && !lastPath.startsWith('/welcome')) {
                // console.log("GUARD: Restoring Session ->", lastPath);
                navigate(lastPath, { replace: true });
                return;
            }
        }
        */

        // 3. Onboarding Check
        if (!onboardingCompleted && userType !== 'super_admin') {
            navigate('/onboarding', { replace: true });
            return;
        }

        // 4. Role-Based Access Control
        // Gym/Partner Restricted from Root
        if ((userType === 'gym' || userType === 'gym_owner') && (location.pathname === '/' || location.pathname === '/home')) {
            navigate('/partner', { replace: true });
            return;
        }

        // Non-Partners Restricted from Partner Dashboard
        // ALLOW ENTRY for Registration (PartnerDashboard handles 'No Gym' state)
        /* 
        if (userType !== 'gym' && userType !== 'gym_owner' && location.pathname.startsWith('/partner') && userType !== 'super_admin') {
            navigate('/', { replace: true });
            return;
        }
        */

        // Admin Restricted
        if (location.pathname === '/admin' && userType !== 'super_admin') {
            navigate('/', { replace: true });
            return;
        }

    }, [currentUser, onboardingCompleted, userType, navigate, location.pathname, isLoading]);

    return { isLoading };
};
