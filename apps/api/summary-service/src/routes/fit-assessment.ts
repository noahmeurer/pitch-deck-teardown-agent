import { Router } from 'express';
import { assessFit } from '../controllers/assess-fit'

const router = Router();

router.post('/', assessFit);

export default router;