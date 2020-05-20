import { Router } from 'express';
import * as ctrl from './controller';
import authHandler from '../auth';

const router = Router();

router
  .get('/', ctrl.getUsersHandler)
  .get('/login', ctrl.loginHandler)
  .get('/login/complete', ctrl.loginHandler, ctrl.publishToken)
  .post('/', authHandler, ctrl.signUpHandler, ctrl.sendUserHandler);

export default router;
