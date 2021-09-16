'use strict';

const bcrypt = require('bcrypt');

// const crypto = require('crypto');
const StudentStorage = require('./StudentStorage');
const Error = require('../../utils/Error');
const Auth = require('../Auth/Auth');
const Mail = require('../Mail/Mail');

class Student {
  constructor(req) {
    this.body = req.body;
    this.auth = req.auth;
  }

  async login() {
    const client = this.body;

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
    const client = this.body;
    const saltRounds = 10;
    const passwordSalt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(client.password, passwordSalt);
    const checkedIdAndEmail = await this.checkIdAndEmail();

    if (checkedIdAndEmail.saveable) {
      const studentInfo = { client, passwordSalt, hash };
      const response = await StudentStorage.save(studentInfo);

      if (response) {
        return { success: true, msg: '회원가입에 성공하셨습니다.' };
      }
    }
    return checkedIdAndEmail;
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
    const client = this.body;
    const checkedPassword = await this.checkPassword();

    try {
      if (checkedPassword.success) {
        const saltRounds = 10;
        const passwordSalt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(client.checkNewPassword, passwordSalt);
        const clientInfo = {
          id: checkedPassword.student.id,
          hash,
          passwordSalt,
        };
        const student = await StudentStorage.modifyPasswordSave(clientInfo);

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

    try {
      const clientInfo = {
        id: client.id,
        email: client.email,
      };
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
    const studentInfo = this.auth;

    try {
      const studentInfoId = studentInfo.id;
      const student = await StudentStorage.findOneById(studentInfoId);
      const comparePassword = bcrypt.compareSync(
        client.password,
        student.password
      );

      if (comparePassword) {
        if (client.password !== client.newPassword) {
          if (client.newPassword === client.checkNewPassword) {
            return { success: true, msg: '비밀번호가 일치합니다.', student };
          }
          return { success: false, msg: '비밀번호가 일치하지 않습니다.' };
        }
        return {
          success: false,
          msg: '기존 비밀번호와 다른 비밀번호를 설정해주세요.',
        };
      }
      return { success: false, msg: '비밀번호가 틀렸습니다.' };
    } catch (err) {
      return Error.ctrl(
        '알 수 없는 오류입니다. 서버개발자에게 문의하세요.',
        err
      );
    }
  }

  // async findPassword() {
  //   const client = this.body;
  // const checkSendMail = await Mail.mail();
  // console.log(client);
  // try {
  //   if (checkedIdAndEmail.client) {
  //     const saltRounds = 10;
  //     const passwordSalt = bcrypt.genSaltSync(saltRounds);
  //     const hash = bcrypt.hashSync(client.password, passwordSalt);
  //     const clientInfo = {
  //       id: client.id,
  //       hash,
  //       passwordSalt,
  //     };
  //     const response = await StudentStorage.modifyPasswordSave(clientInfo);

  //     if (response) {
  //       return { success: true, msg: '저장 잘됨' };
  //     }
  //   }
  //   return checkedIdAndEmail;
  // } catch (err) {
  //   return Error.ctrl(
  //     '알 수 없는 오류입니다. 서버개발자에게 문의하세요.',
  //     err
  //   );
  // }
  // }

  async sendEmail() {
    const client = this.body;
    const checkedInfoByEmail = await this.checkIdAndEmailByFind();
    const mailInfo = {
      mail: client.email,
      name: checkedInfoByEmail.name,
      id: checkedInfoByEmail.id,
    };
    const mail = await Mail.mail(mailInfo);

    if (!mail) {
      return { success: false, msg: '메일 발송을 실패하였습니다.' };
    }

    return { success: true, msg: '성공적으로 메일을 발송했습니다.' };
  }

  async checkIdAndEmailByFind() {
    const client = this.body;

    try {
      const checkedId = await StudentStorage.findOneById(client.id);
      const checkedEmail = await StudentStorage.findOneByEmail(client.email);

      if (checkedId === undefined) {
        return { success: false, msg: '가입된 아이디가 아닙니다.' };
      }

      if (checkedEmail === undefined) {
        return { success: false, msg: '가입된 이메일이 아닙니다.' };
      }

      if (checkedId.id !== checkedEmail.id) {
        return { success: false, msg: '아이디 또는 이메일이 틀립니다.' };
      }

      if (checkedId.email !== checkedEmail.email) {
        return { success: false, msg: '아이디 또는 이메일이 틀립니다.' };
      }

      return {
        success: true,
        msg: '일치',
        name: checkedId.name,
        id: checkedId.id,
      };
    } catch (err) {
      return Error.ctrl(
        '알 수 없는 오류입니다. 서버개발자에게 문의하세요.',
        err
      );
    }
  }
}

module.exports = Student;
