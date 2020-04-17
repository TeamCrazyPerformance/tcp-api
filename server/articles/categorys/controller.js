import { database as db } from '../../config';

export const getCategories = (_, res, next) => {
  return db.Category.findAll()
    .then(categories => res.send({ categories }))
    .catch(err => next(err));
};

export const createCategory = (req, res) => {
  const { category: where } = req.body;
  if (!where.name) return res.sendStatus(400);

  return db.Category.findOrCreate({ where }).then(([category, created]) => {
    if (!created) return res.sendStatus(409);
    return res.status(201).send({ category });
  });
};

export const updateCategory = (req, res, next) => {
  const {
    params: { categoryId: id },
    body: { category: info },
  } = req;

  if (!info || !(info.name || info.parent) || !id) return res.sendStatus(400);

  return db.Category.findByPk(id)
    .then(category => category.update({ ...info }))
    .then(category => res.status(200).json({ category }))
    .catch(err => next(err));
};

export const deleteCategory = async (req, res) => {
  const {
    params: { categoryId: id },
  } = req;

  const category = await db.Category.findByPk(id);

  if (!category) return res.sendStatus(404);

  return category
    .destroy()
    .then(() => res.sendStatus(204))
    .catch(err => next(err));
};
