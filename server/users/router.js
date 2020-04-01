import { Router } from 'express';
import { signupHandler, loginHandler, publishToken } from './controller';

const router = Router();

router.get('/login', loginHandler);
router.get('/login/complete', loginHandler, publishToken);

export default router;
