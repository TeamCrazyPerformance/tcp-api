import db from '../config/database';

const postHandler = (req, res) => {
  const { User } = db;

  const { email, name } = req.body;
  User.create({ email, name })
    .then(domain => res.send(domain))
    .catch(() => res.sendStatus(500));
};

const getHandler = (req, res) => {
  const { user } = req;
  res.send(user);
};

export { postHandler, getHandler };
