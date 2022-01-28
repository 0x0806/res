'use strict';
const TIMEOUT = common.platformTimeout(100);
const handle1 = setTimeout(common.mustCall(function() {
  clearTimeout(handle1);
  const handle2 = setTimeout(common.mustNotCall(), TIMEOUT);
  setTimeout(common.mustCall(function() {
    clearTimeout(handle2);
  }), 1);
}), TIMEOUT);
