import { Router } from 'express';
import { generateExecSummary } from '../controllers/generate-exec-summary';

const router = Router();

router.post('/', generateExecSummary);

export default router;