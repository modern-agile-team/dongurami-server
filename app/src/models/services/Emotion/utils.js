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
          cmtNum: req.params.cmtNum,
          depth: 0,
        },
      };
    }
    return {
      studentId: req.auth.id,
      cmtInfo: {
        replyCmtNum: req.params.replyCmtNum,
        depth: 1,
      },
    };
  }

  static makeResponseByStatusCode(req, status) {
    function makeReturnMsg() {
      const apiPath = req.url.slice(1).split('/');
      const target = {
        board: '게시글',
        comment: '댓글',
        'reply-comment': '답글',
      };
      const failContent = {
        liked: '실패했습니다.',
        unliked: '취소되지 않았습니다.',
      };
      const passContent = {
        liked: '',
        unliked: '취소 ',
      };

      if (status === 409) {
        if (apiPath[0] === 'liked') {
          return '이미 좋아요를 눌렀습니다.';
        }
        return '좋아요를 누르지 않았습니다.';
      }
      if (status === 404) {
        return `해당 ${target[apiPath[1]]}이 존재하지 않습니다`;
      }
      if (status === 400) {
        return `해당 ${target[apiPath[1]]}에 좋아요가 ${
          failContent[apiPath[0]]
        }`;
      }
      return `해당 ${target[apiPath[1]]}에 좋아요를 ${
        passContent[apiPath[0]]
      }했습니다.`;
    }

    return {
      status,
      success: status === 200,
      msg: makeReturnMsg(),
    };
  }
}

module.exports = EmotionUtil;
