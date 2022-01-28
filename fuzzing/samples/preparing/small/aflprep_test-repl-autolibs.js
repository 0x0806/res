'use strict';
const assert = require('assert');
const util = require('util');
const repl = require('repl');
const putIn = new ArrayStream();
repl.start('', putIn, null, true);
test1();
function test1() {
  let gotWrite = false;
  putIn.write = function(data) {
    gotWrite = true;
    if (data.length) {
      assert.strictEqual(data,
                         `${util.inspect(require('fs'), null, 2, false)}\n`);
      assert.strictEqual(global.fs, require('fs'));
      test2();
    }
  };
  assert(!gotWrite);
  putIn.run(['fs']);
  assert(gotWrite);
}
function test2() {
  let gotWrite = false;
  putIn.write = function(data) {
    gotWrite = true;
    if (data.length) {
      assert.strictEqual(data, '{}\n');
      assert.strictEqual(val, global.url);
    }
  };
  const val = {};
  global.url = val;
  common.allowGlobals(val);
  assert(!gotWrite);
  putIn.run(['url']);
  assert(gotWrite);
}
