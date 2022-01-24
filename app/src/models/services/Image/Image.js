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

  async saveBoardImg(boardNum) {
    const { images } = this.body;
    const { query } = this;
    const category = boardCategory[this.params.category];

    if (category !== 4) return makeResponse(400, '잘못된 접근입니다.');
    if (!images.length) return makeResponse(400, '이미지가 존재하지 않습니다.');
    if (!Array.isArray(images)) {
      return makeResponse(400, '잘못된 형식입니다.');
    }

    const queryNullKey = getRequestNullKey(query, [
      'boardCategory',
      'boardNum',
    ]);

    if (queryNullKey) {
      return makeResponse(400, `query의 ${queryNullKey}이(가) 빈 값입니다.`);
    }

    const imgInfo = ImageUtil.getimageInfo(images, boardNum);

    try {
      // 홍보 게시판 => 이미지 따로 저장
      // 동아리별 활동일지 및 my-page 글 => 썸네일 지정
      // if (category <= 6) {
      //   const { description } = this.body;
      //   const imgReg = /<img[^>]*src=(["']?([^>"']+)["']?[^>]*)>/i;

      //   imgReg.test(description);

      //   const thumbnail = RegExp.$2;

      //   if (thumbnail.length) imgInfo.push([boardNum, thumbnail]);
      // }

      // 저장될 이미지가 있을때만 images 테이블에 저장
      const saveCnt = await ImageStorage.saveBoardImg(imgInfo);

      if (saveCnt) return Error.dbError();
      return makeResponse(200, '이미지 생성 성공');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async updateBoardImg() {
    const { query } = this;
    const newImages = this.body.images;
    const category = boardCategory[this.params.category];

    if (category !== 4) return makeResponse(400, '잘못된 접근입니다.');
    if (!newImages.length) {
      return makeResponse(400, '이미지가 존재하지 않습니다.');
    }
    if (!Array.isArray(newImages)) {
      return makeResponse(400, '잘못된 형식입니다.');
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
          return Error.dbError();
        }
      }

      if (deleteImages.length) {
        const isDelete = await ImageStorage.deleteBoardImg(deleteImages);

        if (!isDelete) return Error.dbError();
      }
      return makeResponse(200, '이미지 수정 성공');

      // if (category >= 6) {
      //   const { description } = this.body;
      //   const imgReg = /<img[^>]*src=(["']?([^>"']+)["']?[^>]*)>/i;

      //   imgReg.test(description);

      //   const newThumbnail = RegExp.$2;

      //   // 기존 썸넬 존재 x, 새로운 썸넬 존재 o
      //   if (!images[0]) {
      //     if (newThumbnail.length) {
      //       const thumbnailInfo = [[boardNum, newThumbnail]];

      //       await ImageStorage.saveBoardImg(thumbnailInfo);
      //     }
      //     return { success: true };
      //   }
      //   // 기존 썸넬 존재 o
      //   if (images[0].imgPath !== newThumbnail) {
      //     let result;
      //     if (newThumbnail.length) {
      //       // 새 썸넬 존재
      //       const newThumbnailInfo = {
      //         newThumbnail,
      //         boardNum,
      //       };
      //       result = await ImageStorage.updateBoardImg(newThumbnailInfo);
      //     } else {
      //       // 새 썸넬 존재x
      //       result = await ImageStorage.deleteBoardImg([images[0].imgPath]);
      //     }
      //     if (!result) {
      //       return { success: false, msg: '썸네일이 수정되지 않았습니다.' };
      //     }
      //   }
      // }
    } catch (err) {
      return Error.ctrl('', err);
    }
  }
}

module.exports = Image;
