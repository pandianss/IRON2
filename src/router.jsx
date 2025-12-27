import { createBrowserRouter } from 'react-router-dom';
import AppShell from './components/Layout/AppShell';
import Home from './pages/Home';
import Lab from './pages/Lab';
import Arena from './pages/Arena';
import Bazaar from './pages/Bazaar';
import Hub from './pages/Hub';
import Onboarding from './pages/Onboarding';
import Viral from './pages/Viral';
import ExpertStudio from './pages/ExpertStudio';
import Profile from './pages/Profile';
import PartnerDashboard from './pages/PartnerDashboard';

const router = createBrowserRouter([
    {
        path: '/onboarding',
        element: <Onboarding />,
    },
    {
        path: '/',
        element: <AppShell />,
        children: [
            { index: true, element: <Home /> },
            { path: 'lab', element: <Lab /> },
            { path: 'arena', element: <Arena /> },
            { path: 'bazaar', element: <Bazaar /> },
            { path: 'hub', element: <Hub /> },
            { path: 'viral', element: <Viral /> },
            { path: 'studio', element: <ExpertStudio /> },
            { path: 'profile', element: <Profile /> },
            { path: 'partner', element: <PartnerDashboard /> },
        ],
    },
]);

export default router;
