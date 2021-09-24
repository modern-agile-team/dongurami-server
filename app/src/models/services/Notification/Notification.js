'use strict';

const NotificationStorage = require('./NotificationStorage');
// const Error = require('../../utils/Error');

class Notification {
  constructor(req) {
    this.body = req.body;
    this.params = req.params;
  }

  static async findAllById() {
    const { studentId } = this.params;

    const { success, notifications } = await NotificationStorage.findAllById(
      studentId
    );

    if (success) {
      return { success: true, notifications };
    }
    return true;
  }
}
module.exports = Notification;
