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
  '/:id/personal/my-boards',
  loginAuth.loginCheck,
  myPageCtrl.process.findAllBoards
);

router.get(
  '/:id/personal/scrap/:clubNum/:scrapNum',
  loginAuth.loginCheck,
  myPageCtrl.process.findOneScrap
);

// category - > personal
router.get(
  '/:id/:category/:clubNum/:boardNum',
  loginAuth.loginCheck,
  boardCtrl.process.findOneByBoardNum
);

// category - > personal
router.post(
  '/:id/:category/:clubNum',
  loginAuth.loginCheck,
  boardCtrl.process.createBoardNum
);

// category - > personal
router.put(
  '/:id/:category/:clubNum/:boardNum',
  loginAuth.loginCheck,
  boardCtrl.process.updateOneByBoardNum
);
router.put(
  '/:id/personal/scrap/:clubNum/:scrapNum',
  loginAuth.loginCheck,
  myPageCtrl.process.updateOneByScrapNum
);

// category -> personal
router.delete(
  '/:id/:category/:clubNum/:boardNum',
  loginAuth.loginCheck,
  boardCtrl.process.deleteOneByBoardNum
);

router.delete(
  '/:id/personal/scrap/:clubNum/:scrapNum',
  loginAuth.loginCheck,
  myPageCtrl.process.deleteOneByScrapNum
);

router.delete(
  '/:id/personal/:clubNum',
  loginAuth.loginCheck,
  myPageCtrl.process.deleteOneByJoinedClub
);

module.exports = router;
