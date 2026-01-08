import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Button from '../../../components/UI/Button';
import { useAppContext } from '../../../context/AppContext';

const SettingsView = ({ onBack }) => {
    const { preferences, togglePreference } = useAppContext();

    return (
        <div className="page-container fade-in">
            <header className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Button variant="ghost" onClick={onBack} style={{ padding: '8px' }}>
                    <ArrowLeft size={24} />
                </Button>
                <h2 className="title-display" style={{ fontSize: '1.5rem', margin: 0 }}>PREFERENCES</h2>
            </header>
            <div style={{ marginTop: '24px', display: 'grid', gap: '16px' }}>
                {Object.entries(preferences).map(([setting, isEnabled]) => (
                    <div
                        key={setting}
                        onClick={() => togglePreference(setting)}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '16px',
                            background: 'rgba(255,255,255,0.02)',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <span style={{ fontWeight: '600' }}>{setting}</span>
                        <div style={{
                            width: '44px',
                            height: '24px',
                            background: isEnabled ? 'var(--accent-orange)' : '#333',
                            borderRadius: '12px',
                            position: 'relative',
                            transition: 'background-color 0.2s ease'
                        }}>
                            <div style={{
                                width: '20px',
                                height: '20px',
                                background: '#fff',
                                borderRadius: '50%',
                                position: 'absolute',
                                top: '2px',
                                left: isEnabled ? '22px' : '2px',
                                transition: 'left 0.2s cubic-bezier(0.18, 0.89, 0.32, 1.28)'
                            }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SettingsView;
