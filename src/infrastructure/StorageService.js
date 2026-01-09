import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase.config";

const StorageService = {
    /**
     * Uploads a file to Firebase Storage
     * @param {File} file - The file object to upload
     * @param {string} path - The storage path (e.g., 'workouts/user123/workout.jpg')
     * @param {function} onProgress - Callback for upload progress (0-100)
     * @returns {Promise<string>} - The download URL of the uploaded file
     */
    uploadFile: async (file, path, onProgress) => {
        if (!storage) throw new Error("Storage not initialized");

        const storageRef = ref(storage, path);
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise((resolve, reject) => {
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    if (onProgress) onProgress(progress);
                },
                (error) => {
                    console.error("Upload failed:", error);
                    reject(error);
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(downloadURL);
                }
            );
        });
    },

    /**
     * Gets the download URL for a file
     * @param {string} path - The storage path
     * @returns {Promise<string>}
     */
    getDownloadUrl: async (path) => {
        if (!storage) throw new Error("Storage not initialized");
        const storageRef = ref(storage, path);
        return await getDownloadURL(storageRef);
    }
};

export default StorageService;
