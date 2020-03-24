import { Router } from 'express';
import { postHandler, getHandler } from './controller';

const router = Router();

router.post('/login', postHandler);
router.get('/:user', getHandler);

export default router;
