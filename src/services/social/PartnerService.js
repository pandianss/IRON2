
import { DbService, db } from '../../infrastructure/firebase';
import { runTransaction, doc, collection, query, where, getDocs } from 'firebase/firestore';
import { EngineService } from '../engine/EngineService'; // Import Engine

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

        const result = await runTransaction(db, async (transaction) => {
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

            // 4. Invalidate Invite
            transaction.update(inviteRef, {
                status: 'used',
                usedBy: acceptingUser.uid,
                usedAt: new Date().toISOString()
            });

            // 5. ATOMIC SOVEREIGN UPDATE
            // We now update the Ledger and User State WITHIN the same transaction.
            // This guarantees that a Pact cannot exist without corresponding Ledger entries.

            // Update Sender
            await EngineService.processAction(inviteData.senderUid, {
                type: 'PARTNER_LINKED',
                partnerUid: acceptingUser.uid,
                partnerName: acceptingUser.displayName || 'Partner',
                pactId: pactId
            }, transaction);

            // Update Acceptor
            await EngineService.processAction(acceptingUser.uid, {
                type: 'PARTNER_LINKED',
                partnerUid: inviteData.senderUid,
                partnerName: sender.displayName || 'Partner',
                pactId: pactId
            }, transaction);

            return {
                success: true,
                pactId,
                partnerName: sender.displayName,
                sender,
                acceptor
            };
        });

        return result;
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

            // 2. ATOMIC SOVEREIGN UPDATE

            // Update Dissolver
            await EngineService.processAction(currentUser.uid, {
                type: 'PARTNER_DISSOLVED'
            }, transaction);

            // Update Partner
            await EngineService.processAction(partnerUid, {
                type: 'PARTNER_DISSOLVED'
            }, transaction);

            return { success: true };
        });
    },
};
