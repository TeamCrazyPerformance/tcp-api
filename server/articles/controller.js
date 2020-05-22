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

const createArticle = async (req, res, next) => {
  const {
    user,
    body: { article, category: categoryId },
  } = req;

  const category = await db.Category.findByPk(categoryId);

  if (!(article.contents && article.title && category))
    return res.sendStatus(400);

  return db.Article.create(article)
    .then(article => {
      article.setUser(user.id);
      article.setCategory(category);
      return res.status(201).send({ article });
    })
    .catch(err => next(err));
};

const getArticles = (req, res) => {
  const { category, limit, offset } = req.query;
  const { Article } = db;

  Article.filterCategory(category, {
    limit,
    offset,
  }).then(([articles, articlesCount, notices]) => {
    res.send({ articles, articlesCount, notices });
  });
};

const getArticle = async (req, res) => {
  const { article } = req;
  const author = (await article.getUser()).getProfile();

  await article.updateViewCount();

  article.adaptComment().then(comments => {
    const data = article.extract(true);
    res.send({ article: { ...data, author }, comments });
  });
};

const modifyArticle = (req, res, next) => {
  const { title, contents } = req.body.article;
  const { article } = req;

  if (title) article.title = title;
  if (contents) article.contents = contents;

  article
    .save()
    .then(() => res.send({ article }))
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
  createArticle,
  modifyArticle,
  preloadArticle,
  deleteArticle,
  articleAuth,
};
