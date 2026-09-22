import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger';
import { storageConfig } from '../config/storage';

// Configure Cloudinary using environmental variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const hasCloudinaryConfig = () =>
  Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );

const getBackendBaseUrl = () => {
  return process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
};

export class CloudinaryService {
  /**
   * Uploads a file. Attempts Cloudinary cloud storage first if configured.
   * If Cloudinary fails (e.g. invalid/disabled API key, network error, quota)
   * or is unconfigured, it gracefully falls back to local storage so uploads NEVER fail.
   * @param localPath Local filesystem path of the file
   * @param folder Target folder name on Cloudinary
   */
  static async uploadFile(localPath: string, folder: string = 'delala'): Promise<string> {
    if (!fs.existsSync(localPath)) {
      throw new Error(`Upload file not found at: ${localPath}`);
    }

    // --- Attempt Cloudinary upload if configured ---
    if (hasCloudinaryConfig()) {
      try {
        const result = await cloudinary.uploader.upload(localPath, {
          folder,
          resource_type: 'auto',
        });

        // Cleanup local temp file after successful upload to cloud
        if (fs.existsSync(localPath)) {
          try {
            fs.unlinkSync(localPath);
          } catch {}
        }

        logger.info(`[CloudinaryService] Successfully uploaded to Cloudinary: ${result.secure_url}`);
        return result.secure_url;
      } catch (error: any) {
        logger.warn(
          `[CloudinaryService] Cloudinary upload failed (${error?.message || error}). Falling back to local storage.`
        );
        // Do NOT delete localPath! Seamlessly continue to local storage below.
      }
    } else {
      logger.info('[CloudinaryService] Cloudinary credentials not configured — using local storage.');
    }

    // --- Bulletproof Local Storage Fallback ---
    const filename = path.basename(localPath);
    const uploadsDir = storageConfig.uploadDir;

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const destPath = path.join(uploadsDir, filename);

    // If file is not already in the final uploads destination, copy it there
    if (path.resolve(localPath) !== path.resolve(destPath)) {
      fs.copyFileSync(localPath, destPath);
      try {
        fs.unlinkSync(localPath);
      } catch {}
    }

    const backendUrl = getBackendBaseUrl();
    const publicUrl = `${backendUrl}/uploads/${filename}`;
    logger.info(`[Storage] Saved locally and available at: ${publicUrl}`);
    return publicUrl;
  }
}

