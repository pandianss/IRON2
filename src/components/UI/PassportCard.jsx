import React from 'react';
import PropTypes from 'prop-types';
import { ShieldCheck, Map } from 'lucide-react';
import QRCode from 'react-qr-code';

const PassportCard = ({ userName, rank, userId }) => {
    // Generate QR Data securely
    const qrData = JSON.stringify({
        id: userId,
        name: userName,
        rank: rank,
        valid: true,
        issuer: 'IRON_FORGE_SYSTEM'
    });

    return (
        <div className="glass-panel" style={{
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #111 0%, #050505 100%)',
            border: '1px solid var(--border-glass)',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
        }}>
            {/* Holographic Subtle Overlay */}
            <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle at center, rgba(255,255,255,0.02) 0%, transparent 70%)',
                pointerEvents: 'none'
            }}></div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                <div>
                    <h2 className="title-display" style={{
                        fontSize: '1.5rem',
                        fontWeight: '900',
                        fontStyle: 'italic',
                        letterSpacing: '-1px'
                    }}>
                        IRON PASSPORT
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', letterSpacing: '2px' }}>
                        VERIFIED DISCIPLINE
                    </p>
                </div>
                <ShieldCheck color="var(--accent-orange)" size={32} />
            </div>

            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                <div style={{
                    width: '120px',
                    height: '120px',
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '8px'
                }}>
                    <QRCode
                        value={qrData}
                        size={100}
                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                        viewBox={`0 0 256 256`}
                    />
                </div>

                <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: '12px' }}>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>ID NAME</span>
                        <span style={{ fontSize: '1.2rem', fontWeight: '700', fontFamily: 'var(--font-display)' }}>{userName}</span>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>CLEARANCE LEVEL</span>
                        <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--accent-orange)' }}>{rank}</span>
                    </div>
                    <div>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>CHIP ID</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontFamily: 'monospace' }}>{userId}</span>
                    </div>
                </div>
            </div>

            <div style={{
                marginTop: '32px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Map size={14} color="var(--text-muted)" />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>HOME FORGE: ANVIL GYM</span>
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>EXP: DEC 2026</span>
            </div>
        </div>
    );
};

PassportCard.propTypes = {
    userName: PropTypes.string.isRequired,
    rank: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired
};

export default PassportCard;
