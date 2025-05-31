import { Router } from 'express';
import parserSummaryRouter from './parse-and-sum';
import summaryRouter from './exec-summary';

const router = Router();

router.use('/parse', parserSummaryRouter);
router.use('/summary', summaryRouter);

export default router;