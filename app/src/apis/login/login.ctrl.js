'use strict';

const Student = require('../../models/services/Student/Student');

const process = {
  // 로그인
  login: async (req, res) => {
    const student = new Student(req.body);
    const response = await student.login();

    if (response.success) {
      return res.status(200).json(response);
    }
    if (response.isError) {
      return res.status(500).json(response.clientMsg);
    }
    return res.status(400).json(response);
  },
};

module.exports = {
  process,
};
