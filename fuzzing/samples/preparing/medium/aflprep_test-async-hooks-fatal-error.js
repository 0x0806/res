'use strict';
const assert = require('assert');
const childProcess = require('child_process');
const os = require('os');
if (process.argv[2] === 'child') {
  child(process.argv[3], process.argv[4]);
} else {
  main();
}
function child(type, valueType) {
  const { createHook } = require('async_hooks');
  const fs = require('fs');
  createHook({
    [type]() {
      if (valueType === 'symbol') {
        throw Symbol('foo');
      }
      throw null;
    }
  }).enable();
  new Promise((resolve) => resolve())
    .then(() => fs.promises.readFile(__filename, 'utf8'))
    .then(() => process.exit(0));
}
function main() {
  const types = [ 'init', 'before', 'after', 'destroy', 'promiseResolve' ];
  const valueTypes = [
    [ 'null', 'Error: null' ],
    [ 'symbol', 'Error: Symbol(foo)' ],
  ];
  for (const type of types) {
    for (const [valueType, expect] of valueTypes) {
      const cp = childProcess.spawnSync(
        process.execPath,
        [ __filename, 'child', type, valueType ],
        {
          encoding: 'utf8',
        });
      assert.strictEqual(cp.status, 1, type);
      assert.strictEqual(cp.stderr.trim().split(os.EOL)[0], expect, type);
    }
  }
}
