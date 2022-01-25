'use strict';

const ImageStorage = require('./ImageStorage');
const Error = require('../../utils/Error');
const makeResponse = require('../../utils/makeResponse');
const getRequestNullKey = require('../../utils/getRequestNullKey');
const boardCategory = require('../Category/board');
const ImageUtil = require('./Util');

class Image {
  constructor(req) {
    this.body = req.body;
    this.query = req.query;
  }

  async saveBoardImg() {
    const { query } = this;
    const { images } = this.body;
    const category = boardCategory[query.boardCategory];

    if (category !== 4 && category !== 6) {
      return makeResponse(400, '잘못된 접근입니다.');
    }
    if (!Array.isArray(images)) {
      return makeResponse(400, '잘못된 형식입니다.');
    }
    if (!images.length) return makeResponse(400, '이미지가 존재하지 않습니다.');

    const queryNullKey = getRequestNullKey(query, [
      'boardCategory',
      'boardNum',
    ]);

    if (queryNullKey) {
      return makeResponse(400, `query의 ${queryNullKey}이(가) 빈 값입니다.`);
    }

    const imgInfo = ImageUtil.getimageInfo(images, query.boardNum);

    try {
      const saveCnt = await ImageStorage.saveBoardImg(imgInfo);

      if (saveCnt !== imgInfo.length) {
        return makeResponse(400, '알수없는 에러가 발생했습니다.');
      }
      return makeResponse(201, '이미지 생성 성공');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async updateBoardImg() {
    const { query } = this;
    const newImages = this.body.images;
    const category = boardCategory[query.boardCategory];

    if (category !== 4 && category !== 6) {
      return makeResponse(400, '잘못된 접근입니다.');
    }
    if (!Array.isArray(newImages)) {
      return makeResponse(400, '잘못된 형식입니다.');
    }
    if (!newImages.length) {
      return makeResponse(400, '이미지가 존재하지 않습니다.');
    }

    const queryNullKey = getRequestNullKey(query, [
      'boardCategory',
      'boardNum',
    ]);

    if (queryNullKey) {
      return makeResponse(400, `query의 ${queryNullKey}이(가) 빈 값입니다.`);
    }

    try {
      const images = await ImageStorage.findAllByBoardImg(query.boardNum);

      const currentlyImages = images.map((image) => image.imgPath);

      const addImages = ImageUtil.getNotIncludeImages(
        currentlyImages,
        newImages
      );

      const deleteImages = ImageUtil.getNotIncludeImages(
        newImages,
        currentlyImages
      );

      const addImageInfo = ImageUtil.getimageInfo(addImages, query.boardNum);

      if (addImageInfo.length) {
        const saveCnt = await ImageStorage.saveBoardImg(addImageInfo);

        if (addImageInfo.length !== saveCnt) {
          return makeResponse(400, '알수없는 에러가 발생했습니다.');
        }
      }

      if (deleteImages.length) {
        const deleteCnt = await ImageStorage.deleteBoardImg(deleteImages);

        if (deleteImages.length !== deleteCnt) {
          return makeResponse(400, '알수없는 에러가 발생했습니다.');
        }
      }
      return makeResponse(200, '이미지 수정 성공');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }
}

module.exports = Image;
