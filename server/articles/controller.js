import { database as db } from '../config';

const preloadArticle = (req, res, next, articleId) => {
  const { Article } = db;

  Article.findByPk(articleId)
    .then(article => {
      if (!article) return res.sendStatus(404);

      req.article = article;

      return next();
    })
    .catch(() => res.sendStatus(500));
};

//TODO 관리자 계정 Auth 추가하기
const articleAuth = (req, res, next) => {
  const { user, article } = req;
  if (user.id !== article.author) res.sendStatus(401);

  next();
};

const getArticles = (req, res) => {
  const { category, limit, offset } = req.query;
  const { Article } = db;

  Article.filterCategory(category, {
    limit,
    offset,
  }).then(articles => {
    res.send({ articles });
  });
};

const getArticle = (req, res) => {
  const { article } = req;

  article.adaptComment().then(comments => {
    const data = article.extract(true, { comments });
    res.send({ article: data });
  });
};

const modifyArticle = (req, res, next) => {
  const { title, contents } = req.body.article;
  const { article } = req;

  if (title) article.title = title;
  if (contents) article.contents = contents;

  article
    .save()
    .then(() => res.sendStatus(205))
    .catch(err => next(err));
};

const deleteArticle = (req, res, next) => {
  const { article } = req;

  article
    .destroy()
    .then(() => res.sendStatus(205))
    .catch(err => next(err));
};

export {
  getArticles,
  getArticle,
  modifyArticle,
  preloadArticle,
  deleteArticle,
  articleAuth,
};
