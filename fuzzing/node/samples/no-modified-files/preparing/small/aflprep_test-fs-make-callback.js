'use strict';
const assert = require('assert');
const fs = require('fs');
const { sep } = require('path');
tmpdir.refresh();
function testMakeCallback(cb) {
  return function() {
    fs.mkdtemp(`${tmpdir.path}${sep}`, {}, cb);
  };
}
function invalidCallbackThrowsTests() {
  callbackThrowValues.forEach((value) => {
    assert.throws(testMakeCallback(value), {
      code: 'ERR_INVALID_CALLBACK',
      name: 'TypeError'
    });
  });
}
invalidCallbackThrowsTests();
