import { Router } from 'express';
import * as ctrl from './controller';
import authHandler from '../auth';

const router = Router();

router.get('/', ctrl.getArticles);
router.param('articleId', ctrl.preloadArticle);

router.use(authHandler);
router
  .route('/:articleId')
  .get(ctrl.getArticle)
  .patch(ctrl.articleAuth, ctrl.modifyArticle)
  .delete(ctrl.articleAuth, ctrl.deleteArticle);

export default router;
