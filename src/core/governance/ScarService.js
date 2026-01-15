// ScarService.js
// "Scars are permanent. Records are immutable."
// Handles the logging and retrieval of permanent failures.

import { db } from '../../services/backend/firestoreClient';
import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp } from 'firebase/firestore';

export const ScarService = {

    // Log a permanent scar (Breach of Contract)
    inflictScar: async (userId, reason, context = {}) => {
        if (!userId) return;

        // 1. Create the Scar Record
        await addDoc(collection(db, 'user_scars'), {
            userId,
            reason, // e.g., "MISSED_CHECKIN", "FAILED_VERIFICATION"
            severity: 'CRITICAL',
            timestamp: serverTimestamp(),
            context, // Snapshot of state at time of failure
            isPermanent: true // Explicit flag for UI rendering
        });

        // 2. (Optional) We could update a denormalized "scarCount" on the user profile here
        // but for true sovereignty, we count the raw records.
        return { status: 'SCAR_INFLICTED' };
    },

    // Get all scars for a user
    getScars: async (userId) => {
        if (!userId) return [];

        const q = query(
            collection(db, 'user_scars'),
            where('userId', '==', userId),
            orderBy('timestamp', 'desc')
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    // Calculate "Integrity" (Example: 100% - Scars)
    calculateIntegrity: async (userId) => {
        const scars = await ScarService.getScars(userId);
        // integrity logic can be complex, for now simple count
        return {
            scarCount: scars.length,
            integrity: Math.max(0, 100 - (scars.length * 10)) // -10% per scar
        };
    }
};
