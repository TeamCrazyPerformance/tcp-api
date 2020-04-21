import { Router } from 'express';
import * as ctrl from './controller';

const router = Router();

router.route('/').post(ctrl.createComment);

router
  .route('/:commentId')
  .patch(ctrl.updateComment)
  .delete(ctrl.deleteComment);

export default router;
