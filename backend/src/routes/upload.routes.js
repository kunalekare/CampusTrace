import { Router } from 'express';
import multer from 'multer';
import { uploadItemImage, serveLocalFile } from '../controllers/upload.controller.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.post('/item-image', authenticate, upload.single('image'), uploadItemImage);
router.get('/files/:fileName', serveLocalFile);

export default router;