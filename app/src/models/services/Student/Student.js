'use strict';

const StudentStorage = require('./StudentStorage');
const Error = require('../../utils/Error');
const Auth = require('../Auth/Auth');
const EmailAuth = require('../Auth/EmailAuth/EmailAuth');
const EmailAuthStorage = require('../Auth/EmailAuth/EmailAuthStorage');
const ProfileStorage = require('../Profile/ProfileStorage');
const SignUpCheck = require('./SignUpCheck');
const Util = require('./Util');
const makeResponse = require('../../utils/makeResponse');

class Student {
  constructor(req) {
    this.req = req;
    this.body = req.body;
    this.auth = req.auth;
    this.params = req.params;
    this.SALT_ROUNDS = Number(process.env.SALT_ROUNDS);
  }

  async login() {
    const client = this.body;

    if (!Util.idOrPasswordNullCheck(client)) {
      return makeResponse(400, '아이디 또는 비밀번호를 확인해주세요.');
    }

    try {
      const checkedId = await StudentStorage.findOneById(client.id);

      if (!checkedId) return makeResponse(401, '가입된 아이디가 아닙니다.');

      if (Util.comparePassword(client.password, checkedId.password)) {
        const clubNum = await StudentStorage.findOneByLoginedId(client.id);
        const jwt = await Auth.createJWT(checkedId, clubNum);

        return makeResponse(200, '로그인에 성공하셨습니다.', { jwt });
      }
      return makeResponse(401, '잘못된 비밀번호입니다.');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async signUp() {
    const client = this.body;

    const checkFormat = SignUpCheck.infoCheck(client);
    if (!checkFormat.success) return checkFormat;

    try {
      const checkedIdAndEmail = await Util.checkIdAndEmail(client);

      if (checkedIdAndEmail.success) {
        const hashInfo = Util.createHash(client.password);
        const saveInfo = { ...hashInfo, ...client };

        if (await StudentStorage.save(saveInfo)) {
          return makeResponse(201, '회원가입에 성공하셨습니다.');
        }
      }
      return checkedIdAndEmail;
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async findId() {
    const client = this.body;

    if (!Util.idOrEmailNullCheck(client)) {
      return makeResponse(400, '아이디 또는 이메일을 확인해주세요.');
    }

    try {
      const student = await StudentStorage.findOneByNameAndEmail(client);

      if (student) {
        return makeResponse(200, '해당하는 아이디를 찾았습니다.', student);
      }
      return makeResponse(400, '해당하는 아이디가 없습니다.');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async changePassword() {
    const client = this.body;
    const clientInfo = {
      client: this.body,
      auth: this.auth,
    };

    try {
      const checkedPassword = await Util.checkPassword(clientInfo);
      const hashInfo = Util.createHash(client.newPassword);
      const saveInfo = { ...hashInfo, ...client };

      if (checkedPassword.success) {
        saveInfo.id = checkedPassword.student.id;

        if (await StudentStorage.changePasswordSave(saveInfo)) {
          return makeResponse(200, '비밀번호 변경 성공.');
        }
      }
      return checkedPassword;
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async findPassword() {
    const saveInfo = this.body;
    const reqInfo = {
      id: saveInfo.id,
      token: this.params.token,
    };
    const hashInfo = Util.createHash(saveInfo.newPassword);
    const material = { ...hashInfo, ...saveInfo };

    try {
      const checkedByToken = await EmailAuth.checkByUseableToken(reqInfo);
      if (!checkedByToken.success) return checkedByToken;

      const checkedByChangePassword = await Util.checkByChangePassword(
        saveInfo
      );
      if (!checkedByChangePassword.success) return checkedByChangePassword;

      if (!(await StudentStorage.changePasswordSave(material))) {
        return makeResponse(400, '비밀번호 변경에 실패하였습니다.');
      }
      if (!(await EmailAuthStorage.deleteTokenByStudentId(saveInfo.id))) {
        return makeResponse(400, '토큰 삭제에 실패하였습니다.');
      }
      return makeResponse(200, '비밀번호가 변경되었습니다.');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async getUserInfoByJWT() {
    const user = this.auth;

    if (!user) return { success: false, msg: '비로그인 사용자입니다.' };

    delete user.iat;
    delete user.iss;
    delete user.clubNum;

    try {
      if (user) {
        user.club = await ProfileStorage.findAllClubById(user.id);

        return { success: true, msg: '유저 정보 조회 성공', user };
      }
      return { success: false, msg: '유저 정보 조회 실패' };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 얘기해주세요.', err);
    }
  }

  async naverUserCheck() {
    const oAuthUserInfo = this.body;

    try {
      const user = await StudentStorage.findOneBySnsId(oAuthUserInfo.snsId);

      if (user.success) {
        return { success: true, checkedId: user.result.studentId };
      }
      return { success: false, msg: '비회원(회원가입이 필요합니다.)' };
    } catch (err) {
      throw err;
    }
  }

  async naverLogin() {
    const oAuthUserInfo = this.body;

    try {
      const naverUserCheck = await this.naverUserCheck();

      if (naverUserCheck.success) {
        const clubNum = await StudentStorage.findOneByLoginedId(
          naverUserCheck.checkedId
        );
        const userInfo = await StudentStorage.findOneById(
          naverUserCheck.checkedId
        );

        const jwt = await Auth.createJWT(userInfo, clubNum);

        return { success: true, msg: '로그인에 성공하셨습니다.', jwt };
      }
      return {
        success: false,
        msg: '비회원(회원가입이 필요합니다.)',
        name: oAuthUserInfo.name,
        email: oAuthUserInfo.email,
        snsId: oAuthUserInfo.snsId,
      };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 얘기해주세요.', err);
    }
  }

  async naverSignUp() {
    const saveInfo = this.body;

    try {
      const checkedIdAndEmail = await Util.checkIdAndEmail(client);

      if (checkedIdAndEmail.saveable) {
        saveInfo.hash = '';
        saveInfo.passwordSalt = '';

        const response = await StudentStorage.snsSave(saveInfo);

        if (response) {
          return { success: true, msg: '회원가입에 성공하셨습니다.', saveInfo };
        }
        return { success: false, msg: '회원가입에 실패하셨습니다.' };
      }
      return checkedIdAndEmail;
    } catch (err) {
      return Error.ctrl('', err);
    }
  }
}

module.exports = Student;
