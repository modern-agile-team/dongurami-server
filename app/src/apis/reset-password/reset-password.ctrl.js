'use strict';

const Student = require('../../models/services/Student/Student');

const process = {
  resetPassword: async (req, res) => {
    // const auth = req.auth;
    const student = new Student(req.body);
    const response = await student.resetPassword();
    return res.json(response);
  },
};

module.exports = {
  process,
};
