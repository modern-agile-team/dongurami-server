'use strict';

const express = require('express');
const boardCtrl = require('./board.ctrl');
const identityCheck = require('../../middlewares/identify-auth');
const loginCheck = require('../../middlewares/login-auth');
const apiAuth = require('../../middlewares/api-auth');

const router = express.Router();

router.post(
  '/:category',
  apiAuth.apiAuth,
  loginCheck.loginCheck,
  boardCtrl.process.createBoardNum
);

router.get(
  '/:category',
  apiAuth.apiAuth,
  identityCheck.identityCheck,
  boardCtrl.process.findAllByCategoryNum
);
router.get(
  '/promotion/club',
  apiAuth.apiAuth,
  identityCheck.identityCheck,
  boardCtrl.process.findAllByPromotionCategory
);
router.get(
  '/:category/:boardNum',
  apiAuth.apiAuth,
  identityCheck.identityCheck,
  boardCtrl.process.findOneByBoardNum
);

router.put(
  '/:category/:boardNum',
  apiAuth.apiAuth,
  loginCheck.loginCheck,
  boardCtrl.process.updateOneByBoardNum
);

router.patch(
  '/:category/:boardNum',
  apiAuth.apiAuth,
  identityCheck.identityCheck,
  boardCtrl.process.updateOnlyHitByBoardNum
);

router.delete(
  '/:category/:boardNum',
  apiAuth.apiAuth,
  loginCheck.loginCheck,
  boardCtrl.process.deleteOneByBoardNum
);

module.exports = router;
