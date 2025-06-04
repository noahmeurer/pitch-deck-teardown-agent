import { Router } from 'express';
import parserSummaryRouter from './parse-and-sum';
import summaryRouter from './exec-summary';
import fitAssessmentRouter from './fit-assessment';

const router = Router();

router.use('/parse', parserSummaryRouter);
router.use('/summary', summaryRouter);
router.use('/fit', fitAssessmentRouter);

export default router;