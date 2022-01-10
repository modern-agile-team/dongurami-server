'use strict';

const bcrypt = require('bcrypt');

const StudentStorage = require('./StudentStorage');
const Error = require('../../utils/Error');
const Auth = require('../Auth/Auth');
const EmailAuth = require('../Auth/EmailAuth/EmailAuth');
const EmailAuthStorage = require('../Auth/EmailAuth/EmailAuthStorage');
const ProfileStorage = require('../Profile/ProfileStorage');
const SignUpCheck = require('./SignUpCheck');

class Student {
  constructor(req) {
    this.req = req;
    this.body = req.body;
    this.auth = req.auth;
    this.params = req.params;
    this.SALT_ROUNDS = Number(process.env.SALT_ROUNDS);
  }

  static makeResponseMsg(status, msg, extra) {
    const response = {
      success: status < 400,
      status,
      msg,
    };

    for (const info in extra) {
      if (Object.prototype.hasOwnProperty.call(extra, info)) {
        response[info] = extra[info];
      }
    }

    return response;
  }

  static idOrPasswordNullCheck(client) {
    return client.id && client.password;
  }

  static comparePassword(input, stored) {
    return bcrypt.compareSync(input.password, stored.password);
  }

  async login() {
    const client = this.body;

    if (!Student.idOrPasswordNullCheck(client))
      return Student.makeResponseMsg(
        400,
        '아이디 또는 비밀번호를 확인해주세요.'
      );

    try {
      const checkedId = await StudentStorage.findOneById(client.id);

      if (!checkedId) {
        return Student.makeResponseMsg(401, '가입된 아이디가 아닙니다.');
      }

      if (Student.comparePassword(client, checkedId)) {
        const clubNum = await StudentStorage.findOneByLoginedId(client.id);
        const jwt = await Auth.createJWT(checkedId, clubNum);

        return Student.makeResponseMsg(200, '로그인에 성공하셨습니다.', {
          jwt,
        });
      }
      return Student.makeResponseMsg(401, '잘못된 비밀번호입니다.');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async signUp() {
    const saveInfo = this.body;

    if (!SignUpCheck.infoCheck(saveInfo).success) {
      return SignUpCheck.infoCheck(saveInfo);
    }

    try {
      const checkedIdAndEmail = await this.checkIdAndEmail();

      if (checkedIdAndEmail.success) {
        Student.createHash(saveInfo);

        if (await StudentStorage.save(saveInfo)) {
          return Student.makeResponseMsg(201, '회원가입에 성공하셨습니다.');
        }
      }
      return checkedIdAndEmail;
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  static idOrEmailNullCheck(client) {
    return client.name && client.email;
  }

  static createHash(saveInfo) {
    saveInfo.passwordSalt = bcrypt.genSaltSync(this.SALT_ROUNDS);
    saveInfo.hash = bcrypt.hashSync(saveInfo.password, saveInfo.passwordSalt);

    return saveInfo;
  }

  async findId() {
    const client = this.body;

    if (!Student.idOrEmailNullCheck(client)) {
      return Student.makeResponseMsg(400, '아이디 또는 이메일을 확인해주세요.');
    }

    try {
      const student = await StudentStorage.findOneByNameAndEmail(client);

      if (student) {
        return Student.makeResponseMsg(
          200,
          '해당하는 아이디를 찾았습니다.',
          student
        );
      }
      return Student.makeResponseMsg(400, '해당하는 아이디가 없습니다.');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async resetPassword() {
    const saveInfo = this.body;

    try {
      const checkedPassword = await this.checkPassword();

      if (checkedPassword.success) {
        saveInfo.passwordSalt = bcrypt.genSaltSync(this.SALT_ROUNDS);
        saveInfo.hash = bcrypt.hashSync(
          saveInfo.newPassword,
          saveInfo.passwordSalt
        );
        saveInfo.id = checkedPassword.student.id;

        const student = await StudentStorage.modifyPasswordSave(saveInfo);

        if (student) {
          return { success: true, msg: '비밀번호 변경을 성공하였습니다.' };
        }
      }
      return checkedPassword;
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async checkIdAndEmail() {
    const client = this.body;
    const clientInfo = {
      id: client.id,
      email: client.email,
    };

    try {
      const student = await StudentStorage.findOneByIdOrEmail(clientInfo);

      if (student) {
        if (student.id === client.id) {
          return Student.makeResponseMsg(409, '이미 가입된 학번입니다.');
        }
        if (student.email === client.email) {
          return Student.makeResponseMsg(409, '이미 가입된 이메일입니다.');
        }
      }
      return { success: true };
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async checkPassword() {
    const client = this.body;
    const user = this.auth;

    try {
      const userId = user.id;
      const student = await StudentStorage.findOneById(userId);
      const comparePassword = bcrypt.compareSync(
        client.password,
        student.password
      );

      if (comparePassword) {
        if (client.newPassword.length < 8) {
          return { success: false, msg: '비밀번호가 8자리수 미만입니다.' };
        }
        if (client.password === client.newPassword) {
          return {
            success: false,
            msg: '기존 비밀번호와 다른 비밀번호를 설정해주세요.',
          };
        }
        if (client.newPassword === client.checkNewPassword) {
          return { success: true, msg: '비밀번호가 일치합니다.', student };
        }
        return { success: false, msg: '비밀번호가 일치하지 않습니다.' };
      }
      return { success: false, msg: '기존 비밀번호가 틀렸습니다.' };
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  static async isExistIdAndEmail(client) {
    try {
      const checkedId = await StudentStorage.findOneById(client.id);

      if (!checkedId) {
        return Student.makeResponseMsg(400, '가입된 아이디가 아닙니다.');
      }

      const checkedEmail = await StudentStorage.findOneByEmail(client.email);

      if (!checkedEmail) {
        return Student.makeResponseMsg(400, '가입된 이메일이 아닙니다.');
      }
      if (checkedId.email !== checkedEmail.email) {
        return Student.makeResponseMsg(
          400,
          '아이디 또는 이메일이 일치하지 않습니다.'
        );
      }
      const info = {
        name: checkedId.name,
      };
      return Student.makeResponseMsg(200, '확인 성공', info);
    } catch (err) {
      throw err;
    }
  }

  async findPassword() {
    const saveInfo = this.body;
    const { params } = this;
    const reqInfo = {
      id: saveInfo.id,
      token: params.token,
    };

    try {
      const checkedByToken = await EmailAuth.checkByUseableToken(reqInfo);
      if (!checkedByToken.success) return checkedByToken;

      const checkedByChangePassword = await Student.checkByChangePassword(
        saveInfo
      );
      if (!checkedByChangePassword.success) return checkedByChangePassword;

      saveInfo.passwordSalt = bcrypt.genSaltSync(this.SALT_ROUNDS);
      saveInfo.hash = bcrypt.hashSync(
        saveInfo.newPassword,
        saveInfo.passwordSalt
      );

      const isReset = await StudentStorage.modifyPasswordSave(saveInfo);
      if (!isReset) {
        return { success: false, msg: '비밀번호 변경에 실패하였습니다.' };
      }

      const isDeleteToken = await EmailAuthStorage.deleteTokenByStudentId(
        saveInfo.id
      );
      if (!isDeleteToken) {
        return { success: false, msg: '토큰 삭제에 실패하였습니다.' };
      }
      return { success: true, msg: '비밀번호가 변경되었습니다.' };
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  static async checkByChangePassword(client) {
    if (!client.newPassword.length) {
      return Student.makeResponseMsg(400, '비밀번호를 입력해주세요.');
    }
    if (client.newPassword.length < 8) {
      return Student.makeResponseMsg(400, '비밀번호가 8자리수 미만입니다.');
    }
    if (client.newPassword !== client.checkNewPassword) {
      return Student.makeResponseMsg(
        400,
        '비밀번호와 비밀번호확인이 일치하지 않습니다.'
      );
    }
    return { success: true };
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
      const checkedIdAndEmail = await this.checkIdAndEmail();

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
