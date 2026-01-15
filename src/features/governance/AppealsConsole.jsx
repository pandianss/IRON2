import React, { useState } from 'react';
import { useSession } from '../../app/context';
import { useData } from '../../app/context'; // New Import
import Button from '../../components/UI/Button';
import Card from '../../components/UI/Card';
import { Gavel, FileText, Users } from 'lucide-react';
import AppealDetail from './AppealDetail';
import JuryBox from './JuryBox';

const AppealsConsole = () => {
    const { currentUser } = useSession();
    const { users } = useData(); // Get all users for Jury Duty discovery
    const [activeTab, setActiveTab] = useState('MY_APPEALS');
    const [selectedAppeal, setSelectedAppeal] = useState(null);

    // 1. My Appeals (SOURCE: Local Sovereignty)
    // Structure: { [appealId]: AppealObject }
    const myAppeals = Object.values(currentUser?.civil?.active_appeals || {}).map(a => ({
        ...a,
        type: 'MY_APPEALS',
        narrative: a.narrative || "No description provided.",
        plaintiffId: currentUser.uid
    }));

    // 2. Jury Duty (SOURCE: Social Scan)
    // Find appeals in OTHER users where I am summoned as a witness
    const juryDutyAppeals = React.useMemo(() => {
        if (!users || !currentUser) return [];
        const summons = [];

        users.forEach(user => {
            if (user.uid === currentUser.uid) return; // Skip self
            const appeals = user.civil?.active_appeals || {};
            Object.values(appeals).forEach(appeal => {
                // Check if I am a witness? 
                // Currently schema doesn't have 'witnessIds' array, checking 'witnesses' map or status?
                // Assuming appeal.witnessIds exists or we check if status is PENDING_WITNESS and we are in the group
                // For MVP: We look for appeals with status PENDING_WITNESS and assume broadcast (Simplification)
                // OR better: check if my ID is in a 'witnesses' list. 
                // Let's assume the Schema has 'witnessIds' for summoned witnesses.
                if (appeal.witnessIds?.includes(currentUser.uid)) {
                    summons.push({
                        ...appeal,
                        type: 'JURY_DUTY',
                        plaintiffId: user.uid,
                        narrative: appeal.narrative
                    });
                }
            });
        });
        return summons;
    }, [users, currentUser]);

    // 3. Public Record (SOURCE: All Users History)
    const publicAppeals = React.useMemo(() => {
        if (!users) return [];
        return users.flatMap(user => (user.civil?.appeal_history || []).map(hist => ({
            ...hist,
            type: 'PUBLIC',
            plaintiffId: user.uid,
            narrative: hist.narrative
        })));
    }, [users]);

    // Combine for selection
    const getList = () => {
        switch (activeTab) {
            case 'MY_APPEALS': return myAppeals;
            case 'JURY_DUTY': return juryDutyAppeals;
            case 'PUBLIC': return publicAppeals;
            default: return [];
        }
    };

    const filteredAppeals = getList();

    const renderTabs = () => (
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
            <Button
                variant={activeTab === 'MY_APPEALS' ? 'accent' : 'ghost'}
                onClick={() => { setActiveTab('MY_APPEALS'); setSelectedAppeal(null); }}
                icon={FileText}
            >
                My Appeals ({myAppeals.length})
            </Button>
            <Button
                variant={activeTab === 'JURY_DUTY' ? 'accent' : 'ghost'}
                onClick={() => { setActiveTab('JURY_DUTY'); setSelectedAppeal(null); }}
                icon={Gavel}
            >
                Jury Duty ({juryDutyAppeals.length})
            </Button>
            <Button
                variant={activeTab === 'PUBLIC' ? 'accent' : 'ghost'}
                onClick={() => { setActiveTab('PUBLIC'); setSelectedAppeal(null); }}
                icon={Users}
            >
                Public Record
            </Button>
        </div>
    );

    if (selectedAppeal) {
        return (
            <div className="appeals-console" style={{ padding: '24px' }}>
                <AppealDetail appeal={selectedAppeal} onBack={() => setSelectedAppeal(null)} />
                {activeTab === 'JURY_DUTY' && (
                    <JuryBox appealId={selectedAppeal.id} plaintiffId={selectedAppeal.plaintiffId} />
                )}
            </div>
        );
    }

    return (
        <div className="appeals-console" style={{ padding: '24px' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 className="title-display">High Court</h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    The Civil Layer of IRON. Appeal unfair outcomes or serve as a witness for others.
                </p>
                {/* DEBUG */}
                {/* <pre style={{fontSize: '0.7rem', color: '#666'}}>Current User Appeals: {JSON.stringify(currentUser?.civil?.active_appeals)}</pre> */}
            </div>

            {renderTabs()}

            <div className="console-content">
                {filteredAppeals.length > 0 ? (
                    <div className="appeals-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {filteredAppeals.map(appeal => (
                            <Card key={appeal.id} onClick={() => setSelectedAppeal(appeal)} style={{ cursor: 'pointer', border: '1px solid var(--border-glass)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h4 style={{ marginBottom: '4px' }}>Case #{appeal.id ? appeal.id.substring(0, 8) : 'UNK'}</h4>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                            {appeal.narrative || "No details provided"}
                                        </p>
                                    </div>
                                    <div className={`status-badge ${appeal.status}`} style={{
                                        background: appeal.status === 'OPEN' ? 'rgba(0,255,0,0.1)' : 'rgba(255,165,0,0.1)',
                                        color: appeal.status === 'OPEN' ? 'var(--accent-green)' : 'var(--accent-orange)',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '0.8rem'
                                    }}>
                                        {appeal.status}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="placeholder-state" style={{ padding: '32px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                        <h3 style={{ color: 'var(--text-secondary)' }}>No Active Cases</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            {activeTab === 'MY_APPEALS' ? "You haven't filed any appeals yet." :
                                activeTab === 'JURY_DUTY' ? "You are not currently summoned as a witness." :
                                    "No public records found."}
                        </p>
                        {activeTab === 'MY_APPEALS' && (
                            <div style={{ marginTop: '16px' }}>
                                <Button variant="outline">File New Appeal</Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppealsConsole;
