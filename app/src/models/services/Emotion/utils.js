'use strict';

class EmotionUtil {
  static makeEmotionInfo(req) {
    if (req.params.boardNum) {
      return {
        studentId: req.auth.id,
        boardNum: req.params.boardNum,
      };
    }
    if (req.params.cmtNum) {
      return {
        studentId: req.auth.id,
        cmtInfo: {
          cmtNum: this.params.cmtNum,
          depth: 0,
        },
      };
    }
    return {
      studentId: req.auth.id,
      cmtInfo: {
        replyCmtNum: this.params.replyCmtNum,
        depth: 1,
      },
    };
  }
}

module.exports = EmotionUtil;
