import { Router } from 'express';
import * as ctrl from './controller';
import { adminAuth } from '../../auth';

const router = Router();

router
  .route('/')
  .get(ctrl.getCategories)
  .post(adminAuth, ctrl.createCategory);

router
  .route('/:categoryId')
  .all(adminAuth)
  .patch(ctrl.updateCategory)
  .delete(ctrl.deleteCategory);

export default router;
