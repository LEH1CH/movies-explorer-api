const jwt = require('jsonwebtoken');
const { devKey } = require('../utils/devkey');

const { NODE_ENV, JWT_SECRET } = process.env;
const AuthError = require('../errors/auth-error');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new AuthError('Не удалось выполнить авторизацию'));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : devKey,
    );
  } catch (err) {
    next(new AuthError('Не удалось выполнить авторизацию'));
    return;
  }

  req.user = payload;
  next();
};
