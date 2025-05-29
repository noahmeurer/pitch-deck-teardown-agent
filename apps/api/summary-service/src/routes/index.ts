import { Router } from 'express';
import summaryRouter from './summary';

const router = Router();

router.use('/summary', summaryRouter);

export default router;