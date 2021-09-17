'use strict';

const db = require('redis');

const redis = db.createClient({
  host: '127.0.0.1',
  port: 6379,
});

redis.on('error', (error) => {
  console.error(error);
});

class AuthStorage {
  static async saveToken(student) {
    try {
      const result = await redis.set(
        `${student.id}:token`,
        `${student.token}`,
        'EX',
        600
      );
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = AuthStorage;
