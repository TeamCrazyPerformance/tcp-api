import { Router } from 'express';
import {
  signUpHandler,
  loginHandler,
  publishToken,
  sendUserHandler,
} from './controller';
import authHandler from '../auth';

const router = Router();

router.get('/login', loginHandler);
router.get('/login/complete', loginHandler, publishToken);

router.use(authHandler);
router.post('/', signUpHandler, sendUserHandler);

export default router;
