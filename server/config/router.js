import { Router } from 'express';
import { sendUserHandler } from '../users/controller';
import userRouter from '../users/router';
import articleRouter from '../articles/router';
import authHandler from '../auth';

const router = Router();

router.get('/user', authHandler, sendUserHandler);
router.use('/users', userRouter);
router.use('/articles', articleRouter);

export default router;
