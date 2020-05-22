import { Router } from 'express';
import * as ctrl from './controller';
import { adminAuth } from '../../auth';

const router = Router();

router
  .all(adminAuth)
  .post('/', ctrl.createNotice)
  .patch('/:noticeId', ctrl.modifyNotice)
  .delete('/:noticeId', ctrl.deleteNotice);

export default router;
