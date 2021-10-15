'use strict';

const bcrypt = require('bcrypt');

const StudentStorage = require('./StudentStorage');
const Error = require('../../utils/Error');
const Auth = require('../Auth/Auth');
const EmailAuth = require('../Auth/EmailAuth/EmailAuth');
const EmailAuthStorage = require('../Auth/EmailAuth/EmailAuthStorage');

class Student {
  constructor(req) {
    this.body = req.body;
    this.auth = req.auth;
    this.params = req.params;
    this.SALT_ROUNDS = Number(process.env.SALT_ROUNDS);
  }

  async login() {
    const client = this.body;

    if (client.id.length === 0 || client.password.length === 0) {
      return { success: false, msg: '아이디 또는 비밀번호를 확인해주세요.' };
    }

    try {
      const checkedId = await StudentStorage.findOneById(client.id);

      if (checkedId === undefined) {
        return { success: false, msg: '가입된 아이디가 아닙니다.' };
      }

      const comparePassword = bcrypt.compareSync(
        client.password,
        checkedId.password
      );

      if (comparePassword) {
        const clubNum = await StudentStorage.findOneByLoginedId(client.id);
        const jwt = await Auth.createJWT(checkedId, clubNum);

        return { success: true, msg: '로그인에 성공하셨습니다.', jwt };
      }
      return {
        success: false,
        msg: '잘못된 비밀번호입니다.',
      };
    } catch (err) {
      return Error.ctrl(
        '알 수 없는 오류입니다. 서버개발자에게 문의하세요.',
        err
      );
    }
  }

  async signUp() {
    const saveInfo = this.body;

    try {
      // 아이디 이메일 중복여부 확인
      const checkedIdAndEmail = await this.checkIdAndEmail();

      if (checkedIdAndEmail.saveable) {
        saveInfo.passwordSalt = bcrypt.genSaltSync(this.SALT_ROUNDS);
        saveInfo.hash = bcrypt.hashSync(
          saveInfo.password,
          saveInfo.passwordSalt
        );

        // DB에 회원 추가
        const response = await StudentStorage.save(saveInfo);

        if (response) {
          return { success: true, msg: '회원가입에 성공하셨습니다.' };
        }
      }
      return checkedIdAndEmail;
    } catch (err) {
      return Error.ctrl(
        '알 수 없는 오류입니다. 서버개발자에게 문의하세요.',
        err
      );
    }
  }

  async findId() {
    const client = this.body;

    try {
      const clientInfo = {
        name: client.name,
        email: client.email,
      };
      const student = await StudentStorage.findOneByNameAndEmail(clientInfo);

      if (student) {
        return {
          success: true,
          msg: '해당하는 아이디를 확인했습니다.',
          id: student.id,
        };
      }
      return { success: false, msg: '해당하는 아이디가 없습니다.' };
    } catch (err) {
      return Error.ctrl(
        '알 수 없는 오류입니다. 서버개발자에게 문의하세요.',
        err
      );
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
      return Error.ctrl(
        '알 수 없는 오류입니다. 서버개발자에게 문의하세요.',
        err
      );
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

      if (student === undefined) {
        return { saveable: true };
      }
      if (student.id === client.id) {
        return {
          saveable: false,
          msg: '이미 가입된 아이디입니다.',
        };
      }
      if (student.email === client.email) {
        return {
          saveable: false,
          msg: '이미 가입된 이메일입니다.',
        };
      }
      return {
        saveable: false,
        msg: '서버 에러입니다. 서버개발자에게 문의하세요.',
      };
    } catch (err) {
      return Error.ctrl(
        '알 수 없는 오류입니다. 서버개발자에게 문의하세요.',
        err
      );
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
      return { success: false, msg: '비밀번호가 틀렸습니다.' };
    } catch (err) {
      return Error.ctrl(
        '알 수 없는 오류입니다. 서버개발자에게 문의하세요.',
        err
      );
    }
  }

  async isExistIdAndEmail() {
    const client = this.body;

    try {
      const checkedId = await StudentStorage.findOneById(client.id);
      if (checkedId === undefined) {
        return { isExist: false, msg: '가입된 아이디가 아닙니다.' };
      }

      const checkedEmail = await StudentStorage.findOneByEmail(client.email);
      if (checkedEmail === undefined) {
        return { isExist: false, msg: '가입된 이메일이 아닙니다.' };
      }

      if (
        checkedId.id !== checkedEmail.id ||
        checkedId.email !== checkedEmail.email
      ) {
        return {
          isExist: false,
          msg: '아이디 또는 이메일이 일치하지 않습니다.',
        };
      }
      return {
        isExist: true,
        name: checkedId.name,
      };
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
      // 토큰 검증
      const checkedByToken = await EmailAuth.checkByUseableToken(reqInfo);
      if (!checkedByToken.useable) return checkedByToken;

      // 비밀번호 검증
      const checkedByChangePassword = await this.checkByChangePassword();
      if (!checkedByChangePassword.success) return checkedByChangePassword;

      // 암호화
      saveInfo.passwordSalt = bcrypt.genSaltSync(this.SALT_ROUNDS);
      saveInfo.hash = bcrypt.hashSync(
        saveInfo.newPassword,
        saveInfo.passwordSalt
      );

      // DB 수정
      const isReset = await StudentStorage.modifyPasswordSave(saveInfo);
      if (!isReset) {
        return { success: false, msg: '비밀번호 변경에 실패하였습니다.' };
      }

      // 토큰 삭제 && 비밀번호 변경
      const isDeleteToken = await EmailAuthStorage.deleteTokenByStudentId(
        saveInfo.id
      );
      if (!isDeleteToken) {
        return { success: false, msg: '토큰 삭제에 실패하였습니다.' };
      }
      return { success: true, msg: '비밀번호가 변경되었습니다.' };
    } catch (err) {
      return Error.ctrl(
        '알 수 없는 오류입니다. 서버개발자에게 문의하세요.',
        err
      );
    }
  }

  async checkByChangePassword() {
    const client = this.body;

    if (!client.newPassword.length) {
      return { success: false, msg: '비밀번호를 입력해주세요.' };
    }
    if (client.newPassword.length < 8) {
      return { success: false, msg: '비밀번호가 8자리수 미만입니다.' };
    }
    if (client.newPassword !== client.checkNewPassword) {
      return {
        success: false,
        msg: '비밀번호와 비밀번호확인이 일치하지 않습니다.',
      };
    }
    return { success: true };
  }
}

module.exports = Student;
