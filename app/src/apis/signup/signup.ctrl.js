'use strict';

const Student = require('../../models/services/students/Students');

const process = {
  // 회원가입
  signup: async (req, res) => {
    const student = new Student(req.body);
    const response = await student.signup();
    return res.json(response);
  },
};

module.exports = {
  process,
};
