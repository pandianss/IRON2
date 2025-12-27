import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Share2, PencilLine } from 'lucide-react';
import BottomNav from './BottomNav';

const AppShell = () => {
    // We might conceal BottomNav on 'Onboarding' or specific sub-pages if requested.
    // For now, always show it.
    const navigate = useNavigate();

    return (
        <div className="app-container">
            {/* 
        This div mimics the mobile viewport constraint 
        defined in index.css (.app-container).
      */}
            <div style={{ padding: '20px 16px' }}>
                <header style={{
                    marginBottom: '24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    {/* Use strict inline styles or classes for Logo/Header */}
                    <div
                        onClick={() => navigate('/')}
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontWeight: 900,
                            fontSize: '1.5rem',
                            letterSpacing: '-1px',
                            fontStyle: 'italic', // Speed/Slant
                            textTransform: 'uppercase',
                            cursor: 'pointer'
                        }}>
                        IRON<span style={{ color: 'var(--accent-orange)' }}>.</span>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div
                            onClick={() => navigate('/viral')}
                            style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}
                        >
                            <Share2 size={20} />
                        </div>
                        <div
                            onClick={() => navigate('/studio')}
                            style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}
                        >
                            <PencilLine size={20} />
                        </div>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: 'linear-gradient(45deg, var(--text-secondary), var(--bg-glass))',
                            border: '1px solid var(--border-glass)'
                        }}></div>
                    </div>
                </header>

                <main style={{ minHeight: '80vh' }}>
                    <Outlet />{/* Renders the child route */}
                </main>
            </div>

            <BottomNav />
        </div>
    );
};

export default AppShell;
