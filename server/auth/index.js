import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

const EXPIRE = '1h';
const FORBIDDEN = 403;

export const generateJwt = payload => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: EXPIRE,
  });
};

export const adminAuth = (req, res, next) => {
  const token = req.headers.authorization;

  if (req.user) {
    return req.user.isAdmin ? next() : res.sendStatus(FORBIDDEN);
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) next(err);
    if (!decoded.isAdmin) return res.sendStatus(FORBIDDEN);

    req.user = decoded;
    next();
  });
};

export default (req, _, next) => {
  const token = req.headers.authorization;

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) next(err);

    req.user = decoded;
    next();
  });
};
