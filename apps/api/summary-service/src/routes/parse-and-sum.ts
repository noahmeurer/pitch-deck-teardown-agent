import { Router } from 'express';
import { generateMultiHeadingSummary } from '../controllers/generate-summary';

const router = Router();

router.post('/', generateMultiHeadingSummary);

export default router;