'use strict';

const Email = require('../../models/services/Email/Email');

const process = {
  findPassword: async (req, res) => {
    const email = new Email(req.body);
    const response = await email.sendPasswordForLink();
    return res.json(response);
  },
};

module.exports = {
  process,
};
