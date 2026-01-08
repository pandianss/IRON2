import React from 'react';
import { Save, Play, Plus, ChevronRight } from 'lucide-react';
import Card from '../../../components/UI/Card';
import Button from '../../../components/UI/Button';

const RoutineArchitect = ({ routineName, setRoutineName, exercises, addExercise }) => (
    <div className="fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 className="section-label">ROUTINE ARCHITECT</h3>
            <div style={{ display: 'flex', gap: '12px' }}>
                <Button variant="ghost" style={{ padding: '4px' }}><Save size={20} /></Button>
                <Button variant="ghost" style={{ padding: '4px' }}><Play size={20} color="var(--accent-orange)" /></Button>
            </div>
        </div>

        <Card className="glass-panel" style={{ padding: '24px', marginBottom: '16px' }}>
            <input
                className="iron-input-border title-display"
                value={routineName}
                onChange={(e) => setRoutineName(e.target.value)}
                style={{ fontSize: '1.5rem', marginBottom: '24px' }}
            />

            <div style={{ display: 'grid', gap: '12px' }}>
                {exercises.map((ex) => (
                    <div key={ex.id} className="list-item-standard" style={{
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '12px',
                        border: '1px solid var(--border-glass)'
                    }}>
                        <div style={{ flex: 1 }}>
                            <span style={{ fontWeight: '700', fontSize: '1rem', display: 'block' }}>{ex.name}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                {ex.sets} SETS • {ex.reps} REPS • RPE {ex.rpe}
                            </span>
                        </div>
                        <ChevronRight size={18} color="var(--text-muted)" />
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '24px' }}>
                <Button fullWidth variant="secondary" icon={Plus} onClick={addExercise}>
                    Add Exercise
                </Button>
            </div>
        </Card>
    </div>
);

export default RoutineArchitect;
