import passport from '../auth/passport';
import { generateJwt } from '../auth';
import { database as db } from '../config';

const CLIENT_URI = process.env.CLIENT_URI;
const STRATEGY = 'github';
const COOKIE_NAME = 'jwt';
const COOKIE_OPTION = {
  maxAge: 1 * 60 * 60 * 1000, // 1시간
};

const loginHandler = (req, res, next) => {
  passport.authenticate(STRATEGY, {
    failureRedirect: `${CLIENT_URI}/login`,
  })(req, res, next);
};

const getUserHandler = (req, res) => {
  const { user } = req;

  delete user.iat;
  delete user.exp;

  const token = generateJwt(user);

  res.clearCookie(COOKIE_NAME).json({
    user: {
      ...user,
      token,
    },
  });
};

const publishToken = (req, res) => {
  const { user } = req;
  const token = generateJwt(user);
  const isExistUser = req.user.exist;

  res
    .cookie(COOKIE_NAME, token, COOKIE_OPTION)
    .redirect(isExistUser ? CLIENT_URI : `${CLIENT_URI}/signup`);
};

const signUpHandler = (req, res) => {
  if (req.user.exist) return res.status(404).send({ message: 'Cannot Signup' });
  const { User } = db;
  const { user } = req.body;

  User.updateInfo(user).then(([result]) => {
    if (!result) return res.status(404).send({ message: 'Cannot Signup' });

    const { id, avatar, name } = user;
    const token = generateJwt({ id, avatar, name });

    res
      .cookie(COOKIE_NAME, token, COOKIE_OPTION)
      .status(201)
      .json({
        user: { ...user, token },
      });
  });
};

export { loginHandler, publishToken, signUpHandler, getUserHandler };
