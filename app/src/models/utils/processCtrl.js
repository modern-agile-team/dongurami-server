'use strict';

const logger = require('../../config/logger');

function processCtrl(res, apiInfo, nextFlag = 0) {
  function createLoggerMsg() {
    if (apiInfo.response.status === undefined) {
      return `${apiInfo.method} ${apiInfo.path} 500: \n${apiInfo.response.errMsg.stack}`;
    }
    return `${apiInfo.method} ${apiInfo.path} ${apiInfo.response.status}: ${apiInfo.response.msg}`;
  }

  function createLogger() {
    if (nextFlag && apiInfo.response.status < 300) return true;
    if (apiInfo.response.status < 400) {
      return logger.info(createLoggerMsg());
    }
    return logger.error(createLoggerMsg());
  }

  function responseToClient(response) {
    if (nextFlag && apiInfo.response.status < 300) return true;
    if (response.status === undefined) {
      return res.status(500).json(response.clientMsg);
    }
    return res.status(response.status).json(response);
  }

  createLogger();
  return responseToClient(apiInfo.response);
}

module.exports = processCtrl;
