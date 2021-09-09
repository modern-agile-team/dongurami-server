'use strict';

const bcrypt = require('bcrypt');

const StudentStorage = require('./StudentStorage');
const Error = require('../../utils/Error');
const Auth = require('../Auth/Auth');

class Student {
  constructor(body) {
    this.body = body;
  }

  async login() {
    const client = this.body;

    try {
      const inspector = await StudentStorage.findOneById(client.id);

      if (inspector === undefined) {
        return { success: false, msg: '가입된 아이디가 아닙니다.' };
      }

      const comparePassword = bcrypt.compareSync(
        client.password,
        inspector.password
      );

      if (comparePassword) {
        const clubNum = await StudentStorage.findOneByLoginedId(client.id);
        const jwt = await Auth.createJWT(inspector, clubNum);

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
    const inspector = await this.inspectIdAndEmail();

    if (inspector.saveable) {
      const studentInfo = { client, passwordSalt, hash };
      const response = await StudentStorage.save(studentInfo);

      if (response) {
        return { success: true, msg: '회원가입에 성공하셨습니다.' };
      }
    }
    return inspector;
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
    const inspector = await this.inspectPassword();

    try {
      if (inspector.success) {
        const saltRounds = 10;
        const passwordSalt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(client.password, passwordSalt);
        const clientInfo = {
          id: inspector.student.id,
          hash,
          passwordSalt,
        };
        const student = await StudentStorage.modifyPasswordSave(clientInfo);

        if (student) {
          return { success: true, msg: '비밀번호 변경을 성공하였습니다.' };
        }
      }
      return inspector;
    } catch (err) {
      return Error.ctrl(
        '알 수 없는 오류입니다. 서버개발자에게 문의하세요.',
        err
      );
    }
  }

  async inspectIdAndEmail() {
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

  async inspectPassword() {
    const client = this.body; // 원비밀번호, 새로운비밀번호, 새로운 비밀번호확인

    try {
      const { id } = req.auth;
      const student = await StudentStorage.findOneById(id);

      // if (student === undefiend) 인지 검증을 해야하는지 ? why? 어차피 payload에서 온거면 아이디가 틀릴수가 없는디 ?
      const comparePassword = bcrypt.compareSync(
        client.password,
        student.password
      );

      if (comparePassword) {
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

  // async isExistIdAndEmail() {
  //   const client = this.body;

  //   try {
  //     const { id } = req.auth;
  //     // const clientInfo = {
  //     //   id: client.id,
  //     //   email: client.email,
  //     // };
  //     // const student = await StudentStorage.findOneByIdAndEmail(clientInfo);

  //     // if (student) {
  //     //   if (student.id !== client.id) {
  //     //     return { isExist: false, msg: '등록되지 않은 아이디입니다.' };
  //     //   }
  //     //   if (student.email !== client.email) {
  //     //     return { isExist: false, msg: '등록되지 않은 이메일입니다.' };
  //     //   }
  //     //   return { isExist: true, msg: '등록된 계정입니다.', student };
  //     // }
  //     // return { isExist: false, msg: '등록되지 않은 계정입니다.' };
  //   } catch (err) {
  //     return Error.ctrl(
  //       '알 수 없는 오류입니다. 서버개발자에게 문의하세요.',
  //       err
  //     );
  //   }
  // }
}

module.exports = Student;
