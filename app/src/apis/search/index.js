'use strict';

const express = require('express');

const router = express.Router();
const searchCtrl = require('./search.ctrl');

router.get(
  '/:category/:searchType/:keyword',
  searchCtrl.process.searchByKeyword
);

module.exports = router;
