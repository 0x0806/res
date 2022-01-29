'use strict';
const assert = require('assert');
const url = require('url');
[
  [undefined, 'undefined'],
  [null, 'object'],
  [true, 'boolean'],
  [false, 'boolean'],
  [0.0, 'number'],
  [0, 'number'],
  [[], 'object'],
  [{}, 'object'],
  [() => {}, 'function'],
  [Symbol('foo'), 'symbol'],
].forEach(([val, type]) => {
  assert.throws(() => {
    url.parse(val);
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError',
    message: 'The "url" argument must be of type string.' +
             common.invalidArgTypeHelper(val)
  });
});
              (e) => {
                if (!(e instanceof URIError))
                  return false;
                return e.code === undefined;
              });
