// EraService.js
// "Institutional Memory".
// Manages the lifecycle of "Eras". A Breach kills an Era.

import { db } from '../../services/backend/firestoreClient';
import { collection, doc, setDoc, getDocs, query, where, orderBy, serverTimestamp, updateDoc, limit } from 'firebase/firestore';

export const EraService = {

    // START A NEW ERA (Genesis or Rebirth)
    startNewEra: async (userId) => {
        if (!userId) return;

        // 1. Get previous era count
        const history = await EraService.getHistory(userId);
        const nextEraIndex = history.length + 1;

        // 2. Create New Era Record
        const eraId = `era_${userId}_${Date.now()}`;
        const eraRef = doc(db, 'user_eras', eraId);

        await setDoc(eraRef, {
            userId,
            index: nextEraIndex,
            title: nextEraIndex === 1 ? 'The Founding' : `Era ${nextEraIndex}`,
            startDate: serverTimestamp(),
            status: 'ACTIVE',
            survivedDays: 0
        });

        // 3. Reset User State logic (optional, dependent on how deep the reset is)
        // For now, we just track the Era.
        return nextEraIndex;
    },

    // KILL CURRENT ERA (Breach Finalization)
    failCurrentEra: async (userId, reason) => {
        if (!userId) return;

        // Find active era
        const q = query(
            collection(db, 'user_eras'),
            where('userId', '==', userId),
            where('status', '==', 'ACTIVE'),
            limit(1)
        );

        const snapshot = await getDocs(q);
        if (snapshot.empty) return; // No active era to kill

        const activeEra = snapshot.docs[0];

        // Mark as FALLEN
        await updateDoc(activeEra.ref, {
            status: 'FALLEN',
            deathReason: reason || 'PROTOCOL_BREACH',
            endDate: serverTimestamp()
        });
    },

    // GET HISTORY
    getHistory: async (userId) => {
        if (!userId) return [];
        const q = query(
            collection(db, 'user_eras'),
            where('userId', '==', userId),
            orderBy('startDate', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(d => d.data());
    },

    // GET CURRENT ERA
    getCurrentEra: async (userId) => {
        if (!userId) return null;
        const q = query(
            collection(db, 'user_eras'),
            where('userId', '==', userId),
            where('status', '==', 'ACTIVE'),
            limit(1)
        );
        const snapshot = await getDocs(q);
        if (snapshot.empty) return null;
        return snapshot.docs[0].data();
    }
};
