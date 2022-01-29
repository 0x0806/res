'use strict';
const assert = require('assert');
const http = require('http');
assert.throws(() => {
  http.request({
  }).end();
}, {
  code: 'ERR_UNESCAPED_CHARACTERS',
  name: 'TypeError'
});
