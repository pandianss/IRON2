import { createBrowserRouter } from 'react-router-dom';
import React, { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Eager Imports (Critical Path)
import ContractInitiation from '../pages/ContractInitiation';
// import InductionFlow from '../features/induction/InductionFlow'; // Replaces InitialCheckIn
import Onboarding from '../pages/Onboarding';
import AuthPage from '../pages/AuthPage';
import SplashScreen from '../pages/SplashScreen';
import { DailyLoop } from '../features/sovereignty/DailyLoop';

// Helpers
const Loadable = (Component) => (props) => (
    <Suspense fallback={
        <div className="flex bg-black h-screen w-full items-center justify-center">
            <Loader2 className="animate-spin text-slate-700" size={32} />
        </div>
    }>
        <Component {...props} />
    </Suspense>
);

// Lazy Routes (Demoted / Future Refactor)
const GymJoin = lazy(() => import('../pages/GymJoin'));

const router = createBrowserRouter([
    {
        path: '/welcome',
        element: <SplashScreen />,
    },
    {
        path: '/auth',
        element: <AuthPage />,
    },
    {
        path: '/onboarding',
        element: <Onboarding />,
    },
    {
        path: '/checkin/initial',
        element: <ContractInitiation />,
    },
    {
        path: '/join/:gymId',
        element: Loadable(GymJoin),
    },
    {
        path: '/*', // Catch-all for Sovereign Flow
        element: <DailyLoop />
    }
]);

export default router;
