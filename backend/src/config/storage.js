import { BlobServiceClient } from '@azure/storage-blob';
import { appConfig } from './appConfig.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOCAL_UPLOADS_DIR = path.join(__dirname, '../../uploads');

if (!fs.existsSync(LOCAL_UPLOADS_DIR)) {
  fs.mkdirSync(LOCAL_UPLOADS_DIR, { recursive: true });
}

export class StorageService {
  getContainerClient() {
    const connStr = appConfig.storage.connectionString;
    const containerName = appConfig.storage.container || 'campustrace-images';
    if (!connStr) return null;
    try {
      const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
      return blobServiceClient.getContainerClient(containerName);
    } catch (err) {
      console.warn('[Storage] Azure Storage client initialization warning:', err.message);
      return null;
    }
  }

  async uploadFile(buffer, originalName, mimeType) {
    const ext = path.extname(originalName) || '.jpg';
    const blobName = `item_${Date.now()}_${Math.random().toString(36).substring(2, 9)}${ext}`;
    const containerClient = this.getContainerClient();

    if (containerClient) {
      try {
        await containerClient.createIfNotExists();
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        await blockBlobClient.uploadData(buffer, {
          blobHTTPHeaders: { blobContentType: mimeType }
        });
        return {
          blobName,
          url: blockBlobClient.url
        };
      } catch (err) {
        console.warn('[Storage] Azure Blob upload error, fallback to local storage:', err.message);
      }
    }

    const localFilePath = path.join(LOCAL_UPLOADS_DIR, blobName);
    fs.writeFileSync(localFilePath, buffer);
    return {
      blobName,
      url: `/api/uploads/files/${blobName}`
    };
  }

  getLocalFilePath(blobName) {
    return path.join(LOCAL_UPLOADS_DIR, blobName);
  }
}

export const storage = new StorageService();