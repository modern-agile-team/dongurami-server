'use strict';

function getApiInfo(method, response, req) {
  return {
    method,
    response,
    path: req.originalUrl,
  };
}

module.exports = getApiInfo;
