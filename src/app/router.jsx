import { createBrowserRouter } from 'react-router-dom';
import React, { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import AppShell from '../components/Layout/AppShell';

// Eager Imports (Critical Path)
import CommandCenter from '../pages/CommandCenter';
import InitialCheckIn from '../pages/InitialCheckIn';
import Onboarding from '../pages/Onboarding';
import AuthPage from '../pages/AuthPage';
import SplashScreen from '../pages/SplashScreen';

// Lazy Imports (Feature Bundles)
const Lab = lazy(() => import('../pages/Lab'));
const Arena = lazy(() => import('../pages/Arena'));
const Bazaar = lazy(() => import('../pages/Bazaar'));
const Hub = lazy(() => import('../pages/Hub'));
const Viral = lazy(() => import('../pages/Viral'));
const StudioPage = lazy(() => import('../features/studio').then(module => ({ default: module.StudioPage })));
const ProfilePage = lazy(() => import('../identity/profile').then(module => ({ default: module.ProfilePage })));
const KnowledgePage = lazy(() => import('../features/knowledge').then(module => ({ default: module.KnowledgePage })));
const CommandDashboard = lazy(() => import('../features/gym-admin/pages/CommandDashboard'));
const GymDirectory = lazy(() => import('../pages/GymDirectory'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));
const GymJoin = lazy(() => import('../pages/GymJoin'));

// Loading Fallback
const PageLoader = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '50vh', width: '100%' }}>
        <Loader2 className="animate-spin" color="var(--accent-orange)" size={48} />
    </div>
);

const Loadable = (Component) => (
    <Suspense fallback={<PageLoader />}>
        <Component />
    </Suspense>
);

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
        element: <InitialCheckIn />,
    },
    {
        path: '/join/:gymId',
        element: Loadable(GymJoin),
    },
    {
        path: '/',
        element: <AppShell />,
        children: [
            { index: true, element: <CommandCenter /> },
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
        ],
    },
]);

export default router;
