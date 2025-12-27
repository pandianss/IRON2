import { Share2, PencilLine, ArrowLeft, ChevronLeft } from 'lucide-react';
import BottomNav from './BottomNav';
import { useAppContext } from '../../context/AppContext';
import { useLocation } from 'react-router-dom';

const AppShell = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { onboardingCompleted, toast } = useAppContext();

    useEffect(() => {
        if (!onboardingCompleted) {
            navigate('/onboarding');
        }
    }, [onboardingCompleted, navigate]);

    const isSubPage = location.pathname !== '/';
    const showBack = ['/viral', '/studio', '/settings', '/profile'].includes(location.pathname);

    const getPageTitle = (path) => {
        switch (path) {
            case '/viral': return 'THE CIRCUIT';
            case '/studio': return 'STUDIO';
            case '/settings': return 'SETTINGS';
            case '/profile': return 'IDENTITY';
            default: return '';
        }
    };

    return (
        <div className="app-container">
            <div style={{ padding: '20px 16px' }}>
                <header style={{
                    marginBottom: '24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    minHeight: '44px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {showBack ? (
                            <>
                                <div
                                    onClick={() => navigate(-1)}
                                    style={{
                                        cursor: 'pointer',
                                        padding: '8px',
                                        marginLeft: '-8px',
                                        color: 'var(--text-primary)'
                                    }}
                                >
                                    <ChevronLeft size={24} />
                                </div>
                                <h2 className="title-display" style={{ fontSize: '1.2rem', margin: 0 }}>
                                    {getPageTitle(location.pathname)}
                                </h2>
                            </>
                        ) : (
                            <div
                                onClick={() => navigate('/')}
                                style={{
                                    fontFamily: 'var(--font-display)',
                                    fontWeight: 900,
                                    fontSize: '1.5rem',
                                    letterSpacing: '-1px',
                                    fontStyle: 'italic',
                                    textTransform: 'uppercase',
                                    cursor: 'pointer'
                                }}>
                                IRON<span style={{ color: 'var(--accent-orange)' }}>.</span>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {!showBack && (
                            <>
                                <div
                                    onClick={() => navigate('/viral')}
                                    className="icon-box icon-box-muted"
                                    style={{ width: '40px', height: '40px', padding: 0, cursor: 'pointer' }}
                                >
                                    <Share2 size={18} />
                                </div>
                                <div
                                    onClick={() => navigate('/studio')}
                                    className="icon-box icon-box-muted"
                                    style={{ width: '40px', height: '40px', padding: 0, cursor: 'pointer' }}
                                >
                                    <PencilLine size={18} />
                                </div>
                            </>
                        )}
                        <div
                            onClick={() => navigate('/profile')}
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '12px',
                                background: 'linear-gradient(45deg, #222, #111)',
                                border: '1px solid var(--border-glass)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.8rem',
                                fontWeight: '900',
                                color: 'var(--accent-orange)',
                                cursor: 'pointer',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                            }}>
                            MV
                        </div>
                    </div>
                </header>

                <main style={{ minHeight: '80vh' }}>
                    <Outlet />{/* Renders the child route */}
                </main>
            </div>

            {/* Notification Toast */}
            {toast && (
                <div className="fade-in" style={{
                    position: 'fixed',
                    bottom: '100px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--accent-orange)',
                    color: '#000',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontWeight: '900',
                    fontSize: '0.85rem',
                    fontFamily: 'var(--font-display)',
                    zIndex: 1000,
                    boxShadow: '0 10px 30px rgba(255, 77, 0, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    whiteSpace: 'nowrap'
                }}>
                    <Share2 size={16} />
                    {toast.toUpperCase()}
                </div>
            )}

            <BottomNav />
        </div>
    );
};

export default AppShell;
