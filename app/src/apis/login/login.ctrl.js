'use strict';

const Studnet = require('../../models/services/Student/Student');

const process = {
  login: async (req, res) => {
    const student = new Studnet(req.body);
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
