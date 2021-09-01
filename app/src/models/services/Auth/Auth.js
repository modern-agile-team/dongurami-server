'use strict';

const jwt = require('jsonwebtoken');

const { SECRET_KEY } = process.env;

module.exports.createToken = (user) => {
  const payload = {
    id: user.id,
    name: user.name,
    clubNum: user.clubNum,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
  return token;
};

module.exports.verifyToken = (token) => {
  const decoded = jwt.verify(token, SECRET_KEY);
  return decoded;
};
