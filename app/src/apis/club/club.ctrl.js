'use strict';

const ClubStorage = require('../../models/services/ClubList/ClubStorage');

const process = {
  readClubList: async (req, res) => {
    const response = await ClubStorage.readClubList();

    if (response.success) {
      return res.status(200).json(response);
    }
    return res
      .status(500)
      .json({ success: false, msg: '개발자에게 문의 해 주세요.' });
  },
};

module.exports = {
  process,
};
