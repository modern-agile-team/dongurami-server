'use strict';

const ClubStorage = require('../../models/services/ClubList/ClubStorage');

const process = {
  findAll: async (req, res) => {
    const response = await ClubStorage.findAll();

    if (response.success) {
      return res.status(200).json(response);
    }
    return res.status(500).json(response);
  },
};

module.exports = {
  process,
};
