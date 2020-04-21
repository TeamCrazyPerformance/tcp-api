import { Router } from 'express';
import * as ctrl from './controller';
import authHandler from '../auth';
import commentRouter from './comments/router';

const router = Router();

router
  .route('/')
  .get(ctrl.getArticles)
  .post(authHandler, ctrl.createArticle);

router.param('articleId', ctrl.preloadArticle);

router
  .route('/:articleId')
  .all(authHandler)
  .get(ctrl.getArticle)
  .patch(ctrl.articleAuth, ctrl.modifyArticle)
  .delete(ctrl.articleAuth, ctrl.deleteArticle);

router.use('/:articleId/comments', commentRouter);

export default router;
