import { EraService } from '../core/governance/EraService';
import { useSession } from '../app/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const BreachProtocol = () => {
    const { currentUser } = useSession();
    const navigate = useNavigate();

    // PENANCE: The only way out is through.
    const handlePenance = async () => {
        if (!currentUser) return;

        if (window.confirm("WARNING: This will permanently mark the current Era as FALLEN. You will restart at Day 0. Proceed?")) {
            try {
                await EraService.failCurrentEra(currentUser.uid, 'VOLUNTARY_PENANCE');
                await EraService.startNewEra(currentUser.uid);
                // Reload to force fresh state fetch
                window.location.href = '/';
            } catch (e) {
                console.error("Penance failed:", e);
                alert("System Error: Penance could not be recorded.");
            }
        }
    };

    return (
        <div style={{
            height: '100vh',
            background: '#000',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
            textAlign: 'center'
        }}>
            <div style={{
                border: '2px solid red',
                borderRadius: '50%',
                padding: '24px',
                marginBottom: '40px',
                background: 'rgba(255, 0, 0, 0.1)'
            }}>
                <Lock size={64} color="red" />
            </div>

            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'red', marginBottom: '16px' }}>
                ACCESS DENIED
            </h1>

            <p style={{ fontSize: '1.2rem', color: '#888', maxWidth: '500px', marginBottom: '40px' }}>
                Your Standing is <strong>BREACHED</strong>.
                <br />
                The Authority has suspended your privileges.
            </p>

            <Card style={{ padding: '24px', border: '1px solid #333', background: '#050505', maxWidth: '400px', width: '100%' }}>
                <h3 style={{ color: 'var(--accent-orange)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                    <AlertTriangle size={16} /> PROTOCOL VIOLATION
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '24px' }}>
                    You failed to report within the 24h cycle.
                    An immutable Scar has been logged.
                </p>
                <Button onClick={handlePenance} variant="outline" fullWidth style={{ borderColor: 'red', color: 'red' }}>
                    INITIATE PENANCE
                </Button>
            </Card>

            <div style={{ marginTop: 'auto', marginBottom: '20px', fontSize: '0.8rem', color: '#333' }}>
                IRON AUTHORITY SYSTEM /// TERMINAL LOCKED
            </div>
        </div>
    );
};

export default BreachProtocol;
