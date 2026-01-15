// EvidenceService.js
// "The Eye".
// Handles the upload and verification of Proof of Work.

import { StorageService } from '../../infrastructure/firebase';
import { EraService } from './EraService';

export const EvidenceService = {

    /**
     * Uploads a proof file.
     * @param {string} userId 
     * @param {File} file 
     * @returns {Promise<string>} Download URL
     */
    uploadProof: async (userId, file) => {
        if (!userId || !file) throw new Error("Missing ID or File");

        // 1. Get Context (Era) for organization
        const currentEra = await EraService.getCurrentEra(userId);
        const eraId = currentEra ? `era_${currentEra.index}` : 'era_unknown';

        // 2. Name Protocol: proofs/{uid}/{era}/{timestamp}_{filename}
        const timestamp = Date.now();
        // Create a new File object with the correct path logic as name, 
        // OR rely on StorageService's logic. 
        // RealStorageService simply puts it in `uploads/`. 
        // We should probably modify RealStorageService or just accept the flat structure for now 
        // to avoid touching Infrastructure code. 
        // Ideally, we'd want folder structure.

        // Let's wrap the file or modify the name if possible, 
        // but StorageService.uploadFile takes `file` and uses `file.name`.
        // We can create a renamed file object.
        const extension = file.name.split('.').pop();
        const secureName = `proof_${userId}_${eraId}_${timestamp}.${extension}`;
        const renamedFile = new File([file], secureName, { type: file.type });

        return await StorageService.uploadFile(renamedFile);
    }
};
