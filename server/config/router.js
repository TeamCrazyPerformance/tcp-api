import { Router } from 'express';
import { sendUserHandler } from '../users/controller';
import userRouter from '../users/router';
import authHandler from '../auth';

const router = Router();

router.get('/user', authHandler, sendUserHandler);
router.use('/users', userRouter);

export default router;
