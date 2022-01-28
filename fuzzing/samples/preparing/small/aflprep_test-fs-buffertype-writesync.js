'use strict';
const assert = require('assert');
const fs = require('fs');
[
  true, false, 0, 1, Infinity, () => {}, {}, [], undefined, null,
].forEach((value) => {
  assert.throws(
    () => fs.writeSync(1, value),
  );
});
