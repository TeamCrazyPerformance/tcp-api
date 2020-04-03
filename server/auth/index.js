import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

const EXPIRE = '1h';

export const generateJwt = payload => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: EXPIRE,
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
