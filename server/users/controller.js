import passport from '../auth/passport';
import { generateJwt } from '../auth';

const CLIENT_URI = process.env.CLIENT_URI;
const STRATEGY = 'github';
const COOKIE_NAME = 'jwt';
const COOKIE_OPTION = {
  maxAge: 1 * 60 * 60 * 1000, // 1시간
  httpOnly: true,
};

const loginHandler = (req, res, next) => {
  passport.authenticate(STRATEGY, {
    failureRedirect: `${CLIENT_URI}/login`,
  })(req, res, next);
};

const publishToken = (req, res) => {
  const { user } = req;

  const token = generateJwt(user);

  const isExistUser = req.user ? req.user.exist : false;

  res.cookie(COOKIE_NAME, token, COOKIE_OPTION);

  res.redirect(isExistUser ? CLIENT_URI : `${CLIENT_URI}/signup`);
};

export { loginHandler, publishToken };
