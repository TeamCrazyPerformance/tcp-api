import { Router } from 'express';
import { adminAuth } from '../auth';
import userRouter from '../users/router';
import categoryRouter from '../articles/categorys/router';
import articleRouter from '../articles/router';

const router = Router();

router
  .use(adminAuth)
  .use('/users', userRouter)
  .use('/categories', categoryRouter)
  .use('/articles', articleRouter);

export default router;
