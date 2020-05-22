import { database as db } from '../../config';

export const createNotice = (req, res, next) => {
  let { notice } = req.body;

  return db.Notice.createNotice(notice)
    .then(() => res.sendStatus(201))
    .catch(err => next(err));
};

export const modifyNotice = (req, res, next) => {
  const {
    body: { type },
    params: { noticeId: id },
  } = req;

  if (!type) return res.sendStatus(400);

  return db.Notice.findByPk(id)
    .then(notice => {
      notice.type = Number.parseInt(type, 10);
      return notice.save();
    })
    .then(() => res.sendstatus(200))
    .catch(err => next(err));
};

export const deleteNotice = async (req, res, next) => {
  let { noticeId: id } = req.params;

  const notice = await db.Notice.findByPk(id);

  if (!notice) return res.sendStatus(404);

  return notice
    .destroy()
    .then(() => res.sendStatus(204))
    .catch(err => next(err));
};
