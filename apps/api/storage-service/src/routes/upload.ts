import { Router } from 'express';
import multer from 'multer';
import { uploadPDF } from '../controllers/upload-controller';

const upload = multer();
const router = Router();

router.post('/', upload.single('file'), uploadPDF);

export default router;