'use strict';

const Board = require('../../models/services/Board/Board');
const Comment = require('../../models/services/Board/Comment/Comment');
const Image = require('../../models/services/Image/Image');

const process = {
  createBoardNum: async (req, res) => {
    const board = new Board(req);
    const image = new Image(req);
    const response = await board.createBoardNum();

    if (response.success) {
      response.imgNums = await image.saveBoardImg(response.boardNum);
      if (response.imgNums.isError) {
        return res.status(500).json(response.imgNums.clientMsg);
      }
      return res.status(201).json(response);
    }
    if (response.isError) {
      return res.status(500).json(response.clientMsg);
    }
    return res.status(400).json(response);
  },

  findAllByCategoryNum: async (req, res) => {
    const board = new Board(req);
    const response = await board.findAllByCategoryNum();

    if (response.success) return res.status(200).json(response);
    if (response.isError) return res.status(500).json(response.clientMsg);
    return res.status(404).json(response);
  },

  findAllByPromotionCategory: async (req, res) => {
    const board = new Board(req);
    const response = await board.findAllByPromotionCategory();

    if (response.success) return res.status(200).json(response);
    return res.status(500).json(response.clientMsg);
  },

  findOneByBoardNum: async (req, res) => {
    const board = new Board(req);
    const comment = new Comment(req);
    const image = new Image(req);
    const response = await board.findOneByBoardNum();

    if (response.success) {
      const updateBoardHit = await board.updateOnlyHitByNum();
      response.images = await image.findAllByBoardImg();
      response.comments = await comment.findAllByBoardNum();

      if (response.comments.isError) {
        return res.status(500).json(response.comments.clientMsg);
      }
      if (response.images.isError) {
        return res.status(500).json(response.images.clientMsg);
      }
      if (updateBoardHit.isError) {
        return res.status(500).json(updateBoardHit.clientMsg);
      }
      if (response.success) {
        response.board.hit += 1;
        return res.status(200).json(response);
      }
    }
    if (response.isError) return res.status(500).json(response.clientMsg);
    return res.status(404).json(response);
  },

  updateOneByNum: async (req, res) => {
    const board = new Board(req);
    const response = await board.updateOneByNum();

    if (response.success) return res.status(200).json(response);
    if (response.isError) return res.status(500).json(response.clientMsg);
    return res.status(400).json({
      success: false,
      msg: '알 수 없는 에러입니니다. 서버 개발자에게 얘기해주세요.',
    });
  },

  deleteOneByNum: async (req, res) => {
    const board = new Board(req);
    const response = await board.deleteOneByNum();

    if (response.success) return res.status(200).json(response);
    if (response.isError) return res.status(500).json(response.clientMsg);
    return res.status(400).json({
      success: false,
      msg: '알 수 없는 에러입니니다. 서버 개발자에게 얘기해주세요.',
    });
  },
};

module.exports = {
  process,
};
