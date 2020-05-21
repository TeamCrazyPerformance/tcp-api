import { Router } from 'express';
import * as ctrl from './controller';
import authHandler from '../auth';

const router = Router();

router
  .get('/', ctrl.getUsersHandler)
  .post('/', authHandler, ctrl.signUpHandler, ctrl.sendUserHandler)
  .get('/login', ctrl.loginHandler)
  .get('/login/complete', ctrl.loginHandler, ctrl.publishToken)
  .patch('/:userId', ctrl.modifyUserMembershipHandler)
  .delete('/:userId', ctrl.banishUserHandler);

export default router;
