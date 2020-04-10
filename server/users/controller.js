import passport from '../auth/passport';
import { generateJwt } from '../auth';
import { database as db } from '../config';
import { makeQuery } from '../utils';

const CLIENT_URI = process.env.CLIENT_URI;
const STRATEGY = 'github';

const loginHandler = (req, res, next) => {
  passport.authenticate(STRATEGY, {
    failureRedirect: `${CLIENT_URI}/login`,
  })(req, res, next);
};

const getUserHandler = (req, res) => {
  const { user } = req;

  const token = generateJwt(user);

  res.json({
    user: {
      ...user,
      token,
    },
  });
};

const publishToken = (req, res) => {
  const { user } = req;
  const { needSignup } = user;
  const query = makeQuery(user);
  const path = `${CLIENT_URI}${needSignup ? '/signup?' : '/redirect?'}${query}`;

  res.redirect(path);
};

const signUpHandler = (req, res) => {
  if (!req.user.needSignup)
    return res.status(404).send({ message: 'Cannot Signup' });

  const { User } = db;
  const { user } = req.body;

  User.updateInfo(user).then(([result]) => {
    if (!result) return res.status(404).send({ message: 'Cannot Signup' });

    const where = { id: user.id };

    User.findOne({ where }).then(user =>
      res.status(201).json({
        user: user.getAuthToken(),
      }),
    );
  });
};

export { loginHandler, publishToken, signUpHandler, getUserHandler };
