const jwt = require('jsonwebtoken');

const getSecret = () => {
  const secret = process.env.TOKEN_SECRET;
  if (!secret) {
    throw new Error('TOKEN_SECRET is not configured. Please set it in your .env file.');
  }
  return secret;
};

const encodeToken = (payload, options = {}) => {
  const secret = getSecret();
  const signOptions = {
    expiresIn: '2h',
    ...options
  };

  return jwt.sign(payload, secret, signOptions);
};

const decodeToken = (token) => {
  const secret = getSecret();
  return jwt.verify(token, secret);
};

module.exports = {
  encodeToken,
  decodeToken
};
