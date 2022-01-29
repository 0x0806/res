'use strict';
const assert = require('assert');
[undefined, null, '', {}, true, false].forEach((value) => {
  assert.throws(
    () => { sleep(value); },
  );
});
[-1, 3.14, NaN, 4294967296].forEach((value) => {
  assert.throws(
    () => { sleep(value); },
  );
});
