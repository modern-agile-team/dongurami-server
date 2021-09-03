'use strict';

const Student = require('../../models/services/Student/Student');

const process = {
  // 회원가입
  signUp: async (req, res) => {
    const student = new Student(req.body);
    const response = await student.signUp();

    if (response.success) {
      return res.status(201).json(response);
    }
    if (response.isError) {
      return res.status(500).json(response.clientMsg);
    }
    return res.status(409).json(response);
  },
};

module.exports = {
  process,
};
