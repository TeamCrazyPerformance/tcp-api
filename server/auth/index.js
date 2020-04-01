import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

const EXPIRE = '1h';

export const generateJwt = payload => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: EXPIRE,
  });
};

export default (req, _, next) => {
  const token = req.cookies.jwt;

  jwt
    .verify(token, JWT_SECRET)
    .then(decoded => {
      req.user = decoded;
      next();
    })
    .catch(err => next(err));
};
