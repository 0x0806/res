'use strict';
const assert = require('assert');
const { callbackify } = require('util');
{
  const sentinel = new Error(__filename);
  process.once('uncaughtException', (err) => {
    assert.notStrictEqual(err, sentinel);
    console.log(err.message);
  });
  function fn() {
    return Promise.reject(sentinel);
  }
  const cbFn = callbackify(fn);
  cbFn((err, ret) => assert.ifError(err));
}
