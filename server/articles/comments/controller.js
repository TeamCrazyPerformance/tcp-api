import { database as db } from '../../config';

export const createComment = (req, res, next) => {
  const {
    article,
    user,
    body: { comment },
  } = req;

  if (!comment.contents) return res.sendStatus(400);

  return db.Comment.create(comment)
    .then(comment => {
      comment.setUser(user.id);
      comment.setArticle(article);
      return res.status(201).send({ comment });
    })
    .catch(err => next(err));
};

export const updateComment = (req, res, next) => {
  const {
    params: { commentId: id },
    body: { comment: info },
  } = req;

  if (!info || !info.contents || !id) return res.sendStatus(400);

  return db.Comment.findByPk(id)
    .then(comment => comment.update({ ...info }))
    .then(comment => res.status(205).json({ comment }))
    .catch(err => next(err));
};

export const deleteComment = async (req, res, next) => {
  const {
    params: { commentId: id },
    user,
  } = req;

  const comment = await db.Comment.findByPk(id);

  if (!comment) return res.sendStatus(404);
  if (comment.author !== user.id) return res.sendStatus(403);

  return comment
    .destroy()
    .then(() => res.sendStatus(204))
    .catch(err => next(err));
};
