import { createBrowserRouter } from 'react-router-dom';
import React, { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import AppShell from '../components/Layout/AppShell';

// Eager Imports (Critical Path)
import GovernanceConsole from '../pages/GovernanceConsole'; // Replaces CommandCenter
import ContractInitiation from '../pages/ContractInitiation';
import InductionFlow from '../features/induction/InductionFlow'; // Replaces InitialCheckIn
import BreachProtocol from '../pages/BreachProtocol';
import StandingGuard from '../components/Auth/StandingGuard';
import Onboarding from '../pages/Onboarding';
import AuthPage from '../pages/AuthPage';
import SplashScreen from '../pages/SplashScreen';

// ... (Lazy Imports)

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
import { DailyLoop } from '../features/sovereignty/DailyLoop';

// ...

{
    path: '/',
        element: <DailyLoop />,
            // SINGULARITY: No children. The DailyLoop governs all state.
            // Legacy routes are unreachable.
            children: []
},

]);

export default router;
