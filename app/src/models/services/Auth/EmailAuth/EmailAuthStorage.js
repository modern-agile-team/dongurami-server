'use strict';

const db = require('redis');

const redis = db.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
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
        1200
      );
      return result;
    } catch (err) {
      throw err;
    }
  }

  static findOneByStudentId(id) {
    return new Promise((resolve, reject) => {
      redis.get(`${id}:token`, (err, token) => {
        if (err) reject(err);
        else resolve(token);
      });
    });
  }

  static deleteTokenByStudentId(id) {
    return new Promise((resolve, reject) => {
      redis.del(`${id}:token`, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });
  }
}

module.exports = AuthStorage;
