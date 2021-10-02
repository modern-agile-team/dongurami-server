'use strict';

const express = require('express');

const router = express.Router();
const myPageCtrl = require('./my-page.ctrl');
const loginAuth = require('../../middlewares/login-auth');
const boardCtrl = require('../boards/board.ctrl');

router.get(
  '/:id/personal/:clubNum',
  loginAuth.loginCheck,
  myPageCtrl.process.findAllScrapsByClubNum
);

router.get(
  '/:id/personal/:clubNum/:scrapNo',
  loginAuth.loginCheck,
  myPageCtrl.process.findOneScrp
);
// category - > personal
router.post('/:id/:category/:clubNum', boardCtrl.process.createBoardNum);

module.exports = router;
