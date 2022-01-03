'use strict';

const Home = require('../../models/services/Home/Home');
const logger = require('../../config/logger');

const process = {
  findOneByClubNum: async (req, res) => {
    const home = new Home(req);
    const { clubNum } = req.params;
    const response = await home.findOneByClubNum();

    if (response.success) {
      logger.info(`GET /api/club/home/${clubNum} 200: ${response.msg}`);
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(
        `GET /api/club/home/${clubNum} 500: \n${response.errMsg.stack}`
      );
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    logger.error(`GET /api/club/home/${clubNum} 404: ${response.msg}`);
    return res.status(404).json(response);
  },

  updateClubIntroduce: async (req, res) => {
    const home = new Home(req);
    const { clubNum } = req.params;
    const response = await home.updateClubIntroduce();

    if (response.success) {
      logger.info(`PATCH /api/club/home/${clubNum} 200: ${response.msg}`);
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(
        `PATCH /api/club/home/${clubNum} 500: \n${response.errMsg.stack}`
      );
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    logger.error(`PATCH /api/club/home/${clubNum} 403: ${response.msg}`);
    return res.status(403).json(response);
  },

  updateClubLogo: async (req, res) => {
    const home = new Home(req);
    const { clubNum } = req.params;
    const response = await home.updateClubLogo();

    if (response.success) {
      logger.info(`PUT /api/club/home/${clubNum} 200: ${response.msg}`);
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(
        `PUT /api/club/home/${clubNum} 500: \n${response.errMsg.stack}`
      );
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    logger.error(`PUT /api/club/home/${clubNum} 403: ${response.msg}`);
    return res.status(403).json(response);
  },
};

module.exports = {
  process,
};
