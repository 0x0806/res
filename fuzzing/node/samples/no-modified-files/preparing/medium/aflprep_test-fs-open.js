'use strict';
const assert = require('assert');
const fs = require('fs');
let caughtException = false;
try {
} catch (e) {
  assert.strictEqual(e.code, 'ENOENT');
  caughtException = true;
}
assert.strictEqual(caughtException, true);
fs.openSync(__filename);
fs.open(__filename, common.mustSucceed());
fs.open(__filename, 'r', common.mustSucceed());
fs.open(__filename, 'rs', common.mustSucceed());
fs.open(__filename, 'r', 0, common.mustSucceed());
fs.open(__filename, 'r', null, common.mustSucceed());
async function promise() {
  await fs.promises.open(__filename);
  await fs.promises.open(__filename, 'r');
}
promise().then(common.mustCall()).catch(common.mustNotCall());
assert.throws(
  () => fs.open(__filename, 'r', 'boom', common.mustNotCall()),
  {
    code: 'ERR_INVALID_ARG_VALUE',
    name: 'TypeError'
  }
);
for (const extra of [[], ['r'], ['r', 0], ['r', 0, 'bad callback']]) {
  assert.throws(
    () => fs.open(__filename, ...extra),
    {
      code: 'ERR_INVALID_CALLBACK',
      name: 'TypeError'
    }
  );
}
[false, 1, [], {}, null, undefined].forEach((i) => {
  assert.throws(
    () => fs.open(i, 'r', common.mustNotCall()),
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError'
    }
  );
  assert.throws(
    () => fs.openSync(i, 'r', common.mustNotCall()),
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError'
    }
  );
  assert.rejects(
    fs.promises.open(i, 'r'),
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError'
    }
  );
});
[false, [], {}].forEach((mode) => {
  assert.throws(
    () => fs.open(__filename, 'r', mode, common.mustNotCall()),
    {
      code: 'ERR_INVALID_ARG_TYPE'
    }
  );
  assert.throws(
    () => fs.openSync(__filename, 'r', mode, common.mustNotCall()),
    {
      code: 'ERR_INVALID_ARG_TYPE'
    }
  );
  assert.rejects(
    fs.promises.open(__filename, 'r', mode),
    {
      code: 'ERR_INVALID_ARG_TYPE'
    }
  );
});
