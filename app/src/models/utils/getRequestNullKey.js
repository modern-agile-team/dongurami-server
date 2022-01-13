'use strict';

function getRequestNullKey(body, needKeys) {
  return needKeys.filter((key) => !body[key]).join(', ');
}

module.exports = getRequestNullKey;
