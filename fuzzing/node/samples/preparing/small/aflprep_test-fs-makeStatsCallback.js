'use strict';
const assert = require('assert');
const fs = require('fs');
function testMakeStatsCallback(cb) {
  return function() {
    fs.stat(__filename, cb);
  };
}
testMakeStatsCallback(common.mustCall())();
function invalidCallbackThrowsTests() {
  callbackThrowValues.forEach((value) => {
    assert.throws(testMakeStatsCallback(value), {
      code: 'ERR_INVALID_CALLBACK',
      name: 'TypeError'
    });
  });
}
invalidCallbackThrowsTests();
