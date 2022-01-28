'use strict';
const assert = require('assert');
assert.throws(() => {
  url.href = '';
}, {
  name: 'TypeError'
});
assert.deepStrictEqual(url, ref);
