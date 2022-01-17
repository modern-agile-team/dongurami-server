'use strict';

const Comment = require('../../models/services/Board/Comment/Comment');
const getApiInfo = require('../../models/utils/getApiInfo');
const processCtrl = require('../../models/utils/processCtrl');

const process = {
  createCommentNum: async (req, res) => {
    const comment = new Comment(req);
    const response = await comment.createCommentNum();
    const apiInfo = getApiInfo('POST', response, req);

    return processCtrl(res, apiInfo);
  },

  createReplyCommentNum: async (req, res) => {
    const comment = new Comment(req);
    const response = await comment.createReplyCommentNum();
    const apiInfo = getApiInfo('POST', response, req);

    return processCtrl(res, apiInfo);
  },

  findAllByBoardNum: async (req, res) => {
    const comment = new Comment(req);
    const response = await comment.findAllByBoardNum();
    const apiInfo = getApiInfo('GET', response, req);

    return processCtrl(res, apiInfo);
  },

  updateByCommentNum: async (req, res) => {
    const comment = new Comment(req);
    const response = await comment.updateByCommentNum();
    const apiInfo = getApiInfo('PUT', response, req);

    return processCtrl(res, apiInfo);
  },

  updateByReplyCommentNum: async (req, res) => {
    const comment = new Comment(req);
    const response = await comment.updateByReplyCommentNum();
    const apiInfo = getApiInfo('PUT', response, req);

    return processCtrl(res, apiInfo);
  },

  deleteAllByGroupNum: async (req, res) => {
    const comment = new Comment(req);
    const response = await comment.deleteAllByGroupNum();
    const apiInfo = getApiInfo('DELETE', response, req);

    return processCtrl(res, apiInfo);
  },

  deleteOneReplyCommentNum: async (req, res) => {
    const comment = new Comment(req);
    const response = await comment.deleteOneReplyCommentNum();
    const apiInfo = getApiInfo('DELETE', response, req);

    return processCtrl(res, apiInfo);
  },
};

module.exports = {
  process,
};
