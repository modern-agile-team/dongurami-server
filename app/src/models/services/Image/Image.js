'use strict';

const ImageStorage = require('./ImageStorage');
const Error = require('../../utils/Error');
const makeResponse = require('../../utils/makeResponse');
const boardCategory = require('../Category/board');

class Image {
  constructor(req) {
    this.body = req.body;
    this.params = req.params;
  }

  async saveBoardImg(boardNum) {
    const { images } = this.body;
    const category = boardCategory[this.params.category];
    const imgInfo = [];

    if (category !== 4) return makeResponse(400, '잘못된 접근입니다.');
    if (!images.length) return makeResponse(400, '이미지가 존재하지 않습니다.');
    if (!Array.isArray(images)) {
      return makeResponse(400, '잘못된 형식입니다.');
    }

    for (const image of images) {
      imgInfo.push([boardNum, image]);
    }

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
      const image = await ImageStorage.saveBoardImg(imgInfo);

      if (!image.affectedRows) return Error.dbError();
      return makeResponse(200, '이미지 생성 성공');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async findAllByBoardImg() {
    const { boardNum } = this.params;

    try {
      const imgInfo = await ImageStorage.findAllByBoardImg(boardNum);

      return imgInfo;
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async updateBoardImg() {
    const { boardNum } = this.params;
    const newImages = this.body.images;
    const existingImages = [];
    const addImageInfo = [];
    const category = boardCategory[this.params.category];
    const images = await ImageStorage.findAllByBoardImg(boardNum);

    if (category !== 4) return makeResponse(400, '잘못된 접근입니다.');
    if (!images.length) return makeResponse(400, '이미지가 존재하지 않습니다.');
    if (!Array.isArray(newImages)) {
      return makeResponse(400, '잘못된 형식입니다.');
    }

    for (const image of images) {
      existingImages.push(image.imgPath);
    }

    const addImages = newImages.filter((image) => {
      return !existingImages.includes(image);
    });
    const deleteImages = existingImages.filter((image) => {
      return !newImages.includes(image);
    });

    addImages.forEach((image) => addImageInfo.push([boardNum, image]));

    try {
      if (addImageInfo.length) {
        const saveCnt = await ImageStorage.saveBoardImg(addImageInfo);

        if (addImageInfo.length !== saveCnt.affectedRows) {
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
