import { Router } from 'express';
import * as ctrl from './controller';
import authHandler from '../../auth';

const router = Router();

router
  .route('/')
  .get(ctrl.getCategories)
  .post(ctrl.createCategory);

router
  .route('/:categoryId')
  .all(authHandler)
  .patch(ctrl.updateCategory)
  .delete(ctrl.deleteCategory);

export default router;
