'use strict';

const Student = require('../../models/services/students/Students');

// const output = {
//   // 조회
//   list: async (req, res) => {
//     const student = new Student(req.body);
//     const response = await student.list();
//     return res.json(response);
//   },

//   // 로그인
//   login: async (req, res) => {
//     const student = new Student(req.body);
//     const response = await student.login();
//     return res.json(response);
//   },

//   // 회원가입
//   signup: async (req, res) => {
//     const student = new Student(req.body);
//     const response = await student.signup();
//     return res.json(response);
//   },
// };

const process = {
  // // 로그인
  // login: async (req, res) => {
  //   const student = new Student(req.body);
  //   const response = await student.login();
  //   return res.json(response);
  // },

  // 회원가입
  signup: async (req, res) => {
    const student = new Student(req.body);
    const response = await student.signup();
    return res.json(response);
  },
};

module.exports = {
  // output,
  process,
};
