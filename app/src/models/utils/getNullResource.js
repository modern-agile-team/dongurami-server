'use strict';

function getNullResource(resource) {
  for (const key in resource) {
    if (Object.prototype.hasOwnProperty.call(resource, key)) {
      if (!resource[key]) {
        return key;
      }
    }
  }
  return null;
}

module.exports = getNullResource;
