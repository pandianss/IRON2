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
    {
        path: '/',
        element: <AppShell />,
        children: [
            { index: true, element: <GovernanceConsole /> },
            { path: 'lab', element: Loadable(Lab) },
            { path: 'arena', element: Loadable(Arena) },
            { path: 'bazaar', element: Loadable(Bazaar) },
            { path: 'hub', element: Loadable(Hub) },
            { path: 'viral', element: Loadable(Viral) },
            { path: 'studio', element: Loadable(StudioPage) },
            { path: 'profile', element: Loadable(ProfilePage) },
            { path: 'knowledge', element: Loadable(KnowledgePage) },
            { path: 'command', element: Loadable(CommandDashboard) },
            { path: 'gyms', element: Loadable(GymDirectory) },
            { path: 'admin', element: Loadable(AdminDashboard) },
            { path: 'court', element: Loadable(CourtPage) },
            { path: 'mirror', element: Loadable(MirrorPage) },
        ],
    },
]);

export default router;
