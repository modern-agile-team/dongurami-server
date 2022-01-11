'use strict';

function getRequestMissKey(body, needKeys) {
  return needKeys
    .filter((key) => {
      return !Object.keys(body).includes(key);
    })
    .join(', ');
}

module.exports = getRequestMissKey;
