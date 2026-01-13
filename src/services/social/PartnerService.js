
import { DbService, db } from '../../infrastructure/firebase';
import { runTransaction, doc, collection, query, where, getDocs } from 'firebase/firestore';

export const PartnerService = {
    /**
     * Generate a unique 6-character invite code for the current user.
     * We'll store this in a separate 'invites' collection to strictly enforce uniqueness.
     */
    generateInviteCode: async (user) => {
        if (!user || !user.uid) throw new Error("User required to generate invite.");

        // Clean up old invites for this user first (optional housekeeping)

        const code = Math.random().toString(36).substring(2, 8).toUpperCase();

        // Save to 'invites' collection
        await DbService.setDoc('invites', code, {
            senderUid: user.uid,
            senderName: user.displayName,
            createdAt: new Date().toISOString(),
            status: 'valid' // active, used
        });

        return code;
    },

    /**
     * Accept an invite code to form a Pact.
     * @param {string} code - The 6-char invite code.
     * @param {object} acceptingUser - The user accepting the invite.
     */
    acceptInvite: async (code, acceptingUser) => {
        if (!code || !acceptingUser) throw new Error("Invalid code or user.");

        code = code.toUpperCase();

        return await runTransaction(db, async (transaction) => {
            // 1. Validate Code
            const inviteRef = doc(db, 'invites', code);
            const inviteSnap = await transaction.get(inviteRef);

            if (!inviteSnap.exists()) {
                throw new Error("Invalid invite code.");
            }

            const inviteData = inviteSnap.data();

            if (inviteData.status !== 'valid') {
                throw new Error("Invite code has expired or already been used.");
            }

            if (inviteData.senderUid === acceptingUser.uid) {
                throw new Error("You cannot accept your own invite.");
            }

            // 2. Validate Users (Ensure neither has a partner)
            const senderRef = doc(db, 'users', inviteData.senderUid);
            const acceptorRef = doc(db, 'users', acceptingUser.uid);

            const senderSnap = await transaction.get(senderRef);
            const acceptorSnap = await transaction.get(acceptorRef);

            if (!senderSnap.exists() || !acceptorSnap.exists()) {
                throw new Error("User profile not found.");
            }

            const sender = senderSnap.data();
            const acceptor = acceptorSnap.data();

            if (sender.partner || acceptor.partner) {
                throw new Error("One or both users already have a partner.");
            }

            // 3. Create Pact
            // Deterministic ID to avoid duplicates: lowestUid_highestUid
            const uids = [inviteData.senderUid, acceptingUser.uid].sort();
            const pactId = `pact_${uids[0]}_${uids[1]}`;
            const pactRef = doc(db, 'pacts', pactId);

            const newPact = {
                users: uids,
                status: 'active',
                createdAt: new Date().toISOString(),
                streak: 0,
                startedBy: inviteData.senderUid
            };

            transaction.set(pactRef, newPact);

            // 4. Update Users (Denormalize)
            transaction.update(senderRef, {
                partner: {
                    uid: acceptor.uid,
                    name: acceptor.displayName,
                    pactId: pactId,
                    joinedAt: new Date().toISOString()
                }
            });

            transaction.update(acceptorRef, {
                partner: {
                    uid: sender.uid,
                    name: sender.displayName,
                    pactId: pactId,
                    joinedAt: new Date().toISOString()
                }
            });

            // 5. Invalidate Invite
            transaction.update(inviteRef, {
                status: 'used',
                usedBy: acceptingUser.uid,
                usedAt: new Date().toISOString()
            });

            return { success: true, pactId, partnerName: sender.displayName };
        });
    },

    /**
     * Dissolve the current pact.
     */
    dissolvePact: async (currentUser) => {
        if (!currentUser?.partner) throw new Error("No active partner to dissolve.");
        const { pactId, uid: partnerUid } = currentUser.partner;

        return await runTransaction(db, async (transaction) => {
            const pactRef = doc(db, 'pacts', pactId);
            const userRef = doc(db, 'users', currentUser.uid);
            const partnerRef = doc(db, 'users', partnerUid);

            // 1. Update Pact Status
            transaction.update(pactRef, {
                status: 'dissolved',
                dissolvedBy: currentUser.uid,
                dissolvedAt: new Date().toISOString()
            });

            // 2. Clear Partner from both Users
            // Use deleteField() if possible, but null is fine for now if structure allows
            // We use 'null' or delete the field. Let's use deleteField approach conceptually by setting to null for now.
            // Actually, firebase update with deleteField() is cleaner, but let's stick to null for simpler prop checks in UI.

            transaction.update(userRef, { partner: null });
            transaction.update(partnerRef, { partner: null });

            return { success: true };
        });
    }
};
