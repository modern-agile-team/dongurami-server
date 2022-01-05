'use strict';

class EmotionUtil {
  static getTableAndcolumnByEmotionInfo(emotionInfo) {
    if (emotionInfo.boardNum) {
      return { table: 'board_emotions', column: 'board_no' };
    }
    if (emotionInfo.cmtInfo.cmtNum) {
      return { table: 'comment_emotions', column: 'comment_no' };
    }
    return { table: 'reply_comment_emotions', column: 'reply_comment_no' };
  }

  static getTargetValueByEmotionInfo(emotionInfo) {
    return (
      emotionInfo.boardNum ||
      emotionInfo.cmtInfo.cmtNum ||
      emotionInfo.cmtInfo.replyCmtNum
    );
  }

  static makeEmotionInfo(req) {
    const user = req.auth;
    const { params } = req;

    if (params.boardNum) {
      return {
        studentId: user.id,
        boardNum: params.boardNum,
      };
    }
    if (params.cmtNum) {
      return {
        studentId: user.id,
        cmtInfo: {
          cmtNum: params.cmtNum,
          depth: 0,
        },
      };
    }
    return {
      studentId: user.id,
      cmtInfo: {
        replyCmtNum: params.replyCmtNum,
        depth: 1,
      },
    };
  }

  static makeResponseByStatusCode(req, status) {
    const apiPath = req.url.slice(1).split('/');
    const target = {
      board: '게시글',
      comment: '댓글',
      'reply-comment': '답글',
    };

    function makeLikedReturnMsg() {
      if (status === 200) {
        return `해당 ${target[apiPath[1]]}에 좋아요를 했습니다.`;
      }
      if (status === 400) {
        return `해당 ${target[apiPath[1]]}에 좋아요를 실패 했습니다.`;
      }
      if (status === 404) {
        return `해당 ${target[apiPath[1]]}이 존재하지 않습니다.`;
      }
      return `해당 ${target[apiPath[1]]}에 이미 좋아요를 눌렀습니다.`;
    }

    function makeUnlikedReturnMsg() {
      if (status === 200) {
        return `해당 ${target[apiPath[1]]}에 좋아요가 취소 되었습니다.`;
      }
      if (status === 400) {
        return `해당 ${target[apiPath[1]]}에 좋아요가 취소되지 않았습니다.`;
      }
      if (status === 404) {
        return `해당 ${target[apiPath[1]]}이 존재하지 않습니다.`;
      }
      return `해당 ${target[apiPath[1]]}에 좋아요를 누르지 않았습니다.`;
    }

    return {
      status,
      success: status === 200,
      msg:
        apiPath[0] === 'liked' ? makeLikedReturnMsg() : makeUnlikedReturnMsg(),
    };
  }
}

module.exports = EmotionUtil;
