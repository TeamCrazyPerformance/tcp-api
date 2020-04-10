import { Router } from 'express';
import {
  signUpHandler,
  loginHandler,
  publishToken,
  getUserHandler,
} from './controller';
import authHandler from '../auth';

const router = Router();

router.get('/login', loginHandler);
router.get('/login/complete', loginHandler, publishToken);

router.use(authHandler);
router.post('/', signUpHandler);
router.get('/:id', getUserHandler);

export default router;
