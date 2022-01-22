'use strict';

const express = require('express');

const router = express.Router();
const myPageCtrl = require('./my-page.ctrl');
const loginAuth = require('../../middlewares/login-auth');
const boardCtrl = require('../board/board.ctrl');
const apiAuth = require('../../middlewares/api-auth');

router.get(
  '/:id/personal/:clubNum',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  myPageCtrl.process.findAllScrapsAndMyPagePosts
);

router.get(
  '/:id/my-post',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  myPageCtrl.process.findAllBoardsAndComments
);

router.get(
  '/:id/personal/scrap/:clubNum/:scrapNum',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  myPageCtrl.process.findOneScrap
);

router.get(
  '/:id/:category/:clubNum/:boardNum',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  boardCtrl.process.findOneByBoardNum
);

router.post(
  '/:id/:category/:clubNum',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  boardCtrl.process.createBoardNum
);

router.put(
  '/:id/:category/:clubNum/:boardNum',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  boardCtrl.process.updateOneByBoardNum
);
router.put(
  '/:id/personal/scrap/:clubNum/:scrapNum',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  myPageCtrl.process.updateOneByScrapNum
);

// category -> personal
router.delete(
  '/:id/:category/:clubNum/:boardNum',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  boardCtrl.process.deleteOneByBoardNum
);

router.delete(
  '/:id/personal/scrap/:clubNum/:scrapNum',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  myPageCtrl.process.deleteOneByScrapNum
);

router.delete(
  '/:id/personal/:clubNum',
  apiAuth.apiAuth,
  loginAuth.loginCheck,
  myPageCtrl.process.deleteOneByJoinedClub
);

module.exports = router;
