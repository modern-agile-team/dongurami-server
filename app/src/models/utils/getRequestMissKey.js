'use strict';

function getRequestMissKey(body, needKeys) {
  return needKeys
    .filter((key) => {
      if (!Object.keys(body).includes(key)) return true;
      if (!body[key]) return true;
      return false;
    })
    .join(', ');
}

module.exports = getRequestMissKey;
