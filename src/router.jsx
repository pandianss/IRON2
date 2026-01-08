import { createBrowserRouter } from 'react-router-dom';
import AppShell from './components/Layout/AppShell';
import CommandCenter from './pages/CommandCenter';
import Lab from './pages/Lab';
import Arena from './pages/Arena';
import Bazaar from './pages/Bazaar';
import Hub from './pages/Hub';
import Onboarding from './pages/Onboarding';
import Viral from './pages/Viral';
import { StudioPage } from './features/studio';
import { ProfilePage } from './features/profile';
import { KnowledgePage } from './features/knowledge';
import PartnerDashboard from './pages/PartnerDashboard';
import GymDirectory from './pages/GymDirectory';
import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/AdminDashboard';
import SplashScreen from './pages/SplashScreen';

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
        path: '/',
        element: <AppShell />,
        children: [
            { index: true, element: <CommandCenter /> },
            { path: 'lab', element: <Lab /> },
            { path: 'arena', element: <Arena /> },
            { path: 'bazaar', element: <Bazaar /> },
            { path: 'hub', element: <Hub /> },
            { path: 'viral', element: <Viral /> },
            { path: 'studio', element: <StudioPage /> },
            { path: 'profile', element: <ProfilePage /> },
            { path: 'knowledge', element: <KnowledgePage /> },
            { path: 'partner', element: <PartnerDashboard /> },
            { path: 'gyms', element: <GymDirectory /> },
            { path: 'admin', element: <AdminDashboard /> },
        ],
    },
]);

export default router;
