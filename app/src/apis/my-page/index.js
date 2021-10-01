'use strict';

const express = require('express');

const router = express.Router();
const myPageCtrl = require('./my-page.ctrl');
const loginAuth = require('../../middlewares/login-auth');
const boardCtrl = require('../boards/board.ctrl');

router.get(
  '/:id/personal',
  loginAuth.loginCheck,
  myPageCtrl.process.findAllScraps
);
router.get('/:id/personal/:clubNum', myPageCtrl.process.findAllScrapsBySubClub);

// category - > personal
router.post('/:id/:category', boardCtrl.process.createBoardNum);
module.exports = router;
