'use strict';

const ClubStorage = require('../../models/services/ClubList/ClubStorage');

const process = {
  readClubList: async (req, res) => {
    const response = await ClubStorage.readClubList();

    if (response.success) {
      return res.status(200).json(response);
    }
    return res.status(500).json(response);
  },
};

module.exports = {
  process,
};
