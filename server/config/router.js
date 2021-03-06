import { Router } from 'express';
import { sendUserHandler } from '../users/controller';
import adminRouter from '../admin/router';
import userRouter from '../users/router';
import articleRouter from '../articles/router';
import categoryRouter from '../articles/categorys/router';
import authHandler from '../auth';

const router = Router();

router.get('/user', authHandler, sendUserHandler);
router
  .use('/admin', adminRouter)
  .use('/users', userRouter)
  .use('/categories', categoryRouter)
  .use('/articles', articleRouter);

export default router;
