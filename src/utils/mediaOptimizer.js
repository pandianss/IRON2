/**
 * IRON Media Optimizer
 * Handles client-side compression, resizing, and validation of media assets.
 */

// Configuration
const IMG_MAX_WIDTH = 1080; // Standard mobile width
const IMG_QUALITY = 0.8;    // Good balance
const VID_MAX_SIZE = 100 * 1024 * 1024; // 100MB Limit

export const optimizeImage = (file) => {
    return new Promise((resolve, reject) => {
        if (!file.type.match(/image.*/)) {
            reject(new Error("File is not an image"));
            return;
        }

        const reader = new FileReader();
        reader.onload = (readerEvent) => {
            const image = new Image();
            image.onload = () => {
                // Canvas Resize Logic
                const canvas = document.createElement('canvas');
                let width = image.width;
                let height = image.height;

                if (width > IMG_MAX_WIDTH) {
                    height *= IMG_MAX_WIDTH / width;
                    width = IMG_MAX_WIDTH;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(image, 0, 0, width, height);

                // Compress
                const dataUrl = canvas.toDataURL('image/jpeg', IMG_QUALITY);
                resolve(dataUrl);
            };
            image.onerror = () => reject(new Error("Failed to load image"));
            image.src = readerEvent.target.result;
        };
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
    });
};

export const validateVideo = (file) => {
    return new Promise((resolve, reject) => {
        if (!file.type.match(/video.*/)) {
            reject(new Error("File is not a video"));
            return;
        }

        if (file.size > VID_MAX_SIZE) {
            reject(new Error(`Video exceeds limit (${VID_MAX_SIZE / 1024 / 1024}MB)`));
            return;
        }

        // We can't easily resize video client-side without ffmpeg.wasm
        // So we strictly validate.
        resolve(file);
    });
};
