'use strict';

function getNullResource(resource, needKeys) {
  // for (const key in resource) {
  //   if (Object.prototype.hasOwnProperty.call(needKeys, key)) {
  //     if (!key)
  //   }
  // }
  // return null;
  return Object.keys(resource).filter((key) => {
    if (needKeys.includes(key)) {
      return true;
    }
    return false;
  });
}

module.exports = getNullResource;
