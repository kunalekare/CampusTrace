import { storage } from '../config/storage.js';
import { ApiError } from '../utils/ApiError.js';

export class StorageServiceWrapper {
  async uploadImage(file) {
    if (!file) throw ApiError.badRequest('No image file provided');

    // MIME type whitelist
    const allowedMime = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedMime.includes(file.mimetype)) {
      throw ApiError.badRequest('Invalid file type. Only JPEG, PNG, WEBP, and GIF are permitted.');
    }

    // Size limit: 5MB
    if (file.size > 5 * 1024 * 1024) {
      throw ApiError.badRequest('File size exceeds maximum allowed limit of 5MB.');
    }

    return storage.uploadFile(file.buffer, file.originalname, file.mimetype);
  }
}

export const storageService = new StorageServiceWrapper();