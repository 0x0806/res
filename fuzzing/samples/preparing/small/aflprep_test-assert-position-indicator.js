'use strict';
const assert = require('assert');
process.env.NODE_DISABLE_COLORS = true;
process.stderr.columns = 20;
assert.throws(
  () => { assert.deepStrictEqual('a'.repeat(30), 'a'.repeat(31)); },
  (err) => !err.message.includes('^')
);
assert.throws(
  () => { assert.deepStrictEqual('aaaa', 'aaaaa'); },
  (err) => err.message.includes('^')
);
