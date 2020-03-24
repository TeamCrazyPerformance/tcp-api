import { Router } from 'express';
import userRouter from '../users/router';

const router = Router();

router.use('/users', userRouter);

export default router;
