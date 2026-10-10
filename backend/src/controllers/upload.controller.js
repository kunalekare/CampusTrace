import { storageService } from '../services/storage.service.js';
import { storage } from '../config/storage.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import fs from 'fs';

export const uploadItemImage = asyncHandler(async (req, res) => {
  const result = await storageService.uploadImage(req.file);
  res.status(201).json({
    success: true,
    message: 'Image uploaded successfully to Azure Storage',
    data: result
  });
});

export const serveLocalFile = asyncHandler(async (req, res) => {
  const fileName = req.params.fileName;
  const filePath = storage.getLocalFilePath(fileName);
  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }

  // Stream directly from Azure Blob Storage if available
  const containerClient = storage.getContainerClient();
  if (containerClient) {
    try {
      const blockBlobClient = containerClient.getBlockBlobClient(fileName);
      const downloadResponse = await blockBlobClient.download(0);
      res.setHeader('Content-Type', downloadResponse.contentType || 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      downloadResponse.readableStreamBody.pipe(res);
      return;
    } catch (err) {
      // not found in azure
    }
  }

  res.status(404).json({ success: false, message: 'File not found' });
});