'use strict';

const AdminOption = require('../../models/services/AdminOption/AdminOption');
const Application = require('../../models/services/Application/Application');
const logger = require('../../config/logger');

const process = {
  checkClubAdmin: async (req, res, next) => {
    const adminOption = new AdminOption(req);
    const response = await adminOption.checkClubAdmin();
    const { clubNum } = req.params;

    if (!response.success) {
      logger.error(
        `GET /api/club/admin-option/${clubNum} 403: ${response.msg}`
      );
      return res.status(403).json(response);
    }
    return next();
  },

  findOneByClubNum: async (req, res) => {
    const adminOption = new AdminOption(req);
    const application = new Application(req);

    const response = {};
    const { clubNum } = req.params;

    response.clubAdminOption = await adminOption.findOneByClubNum();

    if (response.clubAdminOption.success) {
      response.applicant = await application.findOneByClubNum();

      if (response.applicant.isError) {
        logger.error(
          `GET /api/club/admin-option/${clubNum} 500: \n${response.errMsg}`
        );
        return res.status(500).json(response.applicant.clientMsg);
      }
      if (!response.applicant.success) {
        logger.error(
          `GET /api/club/admin-option/${clubNum} 400: ${response.msg}`
        );
        return res.status(400).json(response);
      }
      logger.info(
        `GET /api/club/admin-option/${clubNum} 200: ${response.clubAdminOption.msg}`
      );
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(
        `GET /api/club/admin-option/${clubNum} 500: \n${response.errMsg}`
      );
      return res.status(500).json(response.clientMsg);
    }
    logger.error(`GET /api/club/admin-option/${clubNum} 400: ${response.msg}`);
    return res.status(400).json(response);
  },

  createMemberById: async (req, res) => {
    const application = new Application(req);
    const response = await application.createMemberById();
    const { clubNum } = req.params;

    if (response.success) {
      logger.info(
        `POST /api/club/admin-option/${clubNum}/applicant 201: ${response.msg}`
      );
      return res.status(201).json(response);
    }
    if (response.isError) {
      logger.error(
        `POST /api/club/admin-option/${clubNum}/applicant 500: \n${response.errMsg}`
      );
      return res.status(500).json(response.clientMsg);
    }
    logger.error(
      `POST /api/club/admin-option/${clubNum}/applicant 400: ${response.msg}`
    );
    return res.status(400).json(response);
  },

  updateLeaderById: async (req, res) => {
    const adminOption = new AdminOption(req);
    const response = await adminOption.updateLeaderById();
    const { clubNum } = req.params;

    if (response.success) {
      logger.info(
        `PUT /api/club/admin-option/${clubNum}/leader 200: ${response.msg}`
      );
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(
        `PUT /api/club/admin-option/${clubNum}/leader 500: \n${response.errMsg}`
      );
      return res.status(500).json(response.clientMsg);
    }
    logger.error(
      `PUT /api/club/admin-option/${clubNum}/leader 400: ${response.msg}`
    );
    return res.status(400).json(response);
  },

  updateAdminOptionById: async (req, res) => {
    const adminOption = new AdminOption(req);
    const response = await adminOption.updateAdminOptionById();
    const { clubNum } = req.params;

    if (response.success) {
      logger.info(
        `PUT /api/club/admin-option/${clubNum}/admin-function 200: ${response.msg}`
      );
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(
        `PUT /api/club/admin-option/${clubNum}/admin-function 500: \n${response.errMsg}`
      );
      return res.status(500).json(response.clientMsg);
    }
    logger.error(
      `PUT /api/club/admin-option/${clubNum}/admin-function 400: ${response.msg}`
    );
    return res.status(400).json(response);
  },

  updateApplicantById: async (req, res) => {
    const application = new Application(req);
    const response = await application.updateApplicantById();
    const { clubNum } = req.params;

    if (response.success) {
      logger.info(
        `PUT /api/club/admin-option/${clubNum}/applicant 200: ${response.msg}`
      );
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(
        `PUT /api/club/admin-option/${clubNum}/applicant 500: \n${response.errMsg}`
      );
      return res.status(500).json(response.clientMsg);
    }
    logger.error(
      `PUT /api/club/admin-option/${clubNum}/applicant 400: ${response.msg}`
    );
    return res.status(400).json(response);
  },

  deleteMemberById: async (req, res) => {
    const adminOption = new AdminOption(req);
    const response = await adminOption.deleteMemberById();
    const { params } = req;

    if (response.success) {
      logger.info(
        `DELETE /api/club/admin-option/${params.clubNum}/${params.memberId} 200: ${response.msg}`
      );
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(
        `DELETE /api/club/admin-option/${params.clubNum}/${params.memberId} 500: \n${response.errMsg}`
      );
      return res.status(500).json(response.clientMsg);
    }
    logger.error(
      `DELETE /api/club/admin-option/${params.clubNum}/${params.memberId} 400: ${response.msg}`
    );
    return res.status(400).json(response);
  },
};

module.exports = {
  process,
};
