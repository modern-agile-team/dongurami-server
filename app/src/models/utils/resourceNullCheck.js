'use strict';

function resourceNullCheck(resource) {
  for (const key in resource) {
    if (Object.prototype.hasOwnProperty.call(resource, key)) {
      if (!resource[key]) return { success: true, status: 400, msg: `` };
    }
  }
  return { success: false };
}

module.exports = resourceNullCheck;
