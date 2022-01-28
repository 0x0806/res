'use strict';
const assert = require('assert');
const debug = require('util').debuglog('test');
const testCases = getTestCases(false);
if (!process.argv[2]) {
  parent();
} else {
  const i = parseInt(process.argv[2]);
  if (Number.isNaN(i)) {
    debug('Invalid test case index');
    process.exit(100);
    return;
  }
  testCases[i].func();
}
function parent() {
  const { spawn } = require('child_process');
  const node = process.execPath;
  const f = __filename;
  const option = { stdio: [ 0, 1, 'ignore' ] };
  const test = (arg, name = 'child', exit) => {
    spawn(node, [f, arg], option).on('exit', (code) => {
      assert.strictEqual(
        code, exit,
        `wrong exit for ${arg}-${name}\nexpected:${exit} but got:${code}`);
      debug(`ok - ${arg} exited with ${exit}`);
    });
  };
  testCases.forEach((tc, i) => test(i, tc.func.name, tc.result));
}
