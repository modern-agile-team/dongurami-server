'use strict';

const Student = require('../../models/services/students/Students');

const process = {
  // 회원가입
  signup: async (req, res) => {
    const student = new Student(req.body);
    const response = await student.signup();
    if (response.success) {
      return res.status(200).json(response);
    }
    return res.status(400).json(response);
  },
};

module.exports = {
  process,
};
