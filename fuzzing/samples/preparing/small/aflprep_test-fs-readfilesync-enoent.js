'use strict';
if (!common.isWindows)
  common.skip('Windows specific test.');
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
function test(p) {
  const result = fs.realpathSync(p);
  assert.strictEqual(result.toLowerCase(), path.resolve(p).toLowerCase());
  fs.realpath(p, common.mustSucceed((result) => {
    assert.strictEqual(result.toLowerCase(), path.resolve(p).toLowerCase());
  }));
}
test(`\\\\${os.hostname()}\\c$\\`);
test('C:\\');
test('C:');
test(process.env.windir);
