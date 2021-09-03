'use strict';

const Studnet = require('../../models/services/Student/Student');

const process = {
  login: async (req, res) => {
    const student = new Studnet(req.body);
    const response = await student.login();
    return res.json(response);
  },
};

module.exports = {
  process,
};
