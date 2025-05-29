import { Router } from 'express';
import { generateSummary } from '../controllers/generate-summary';

const router = Router();

router.post('/', generateSummary)

export default router;