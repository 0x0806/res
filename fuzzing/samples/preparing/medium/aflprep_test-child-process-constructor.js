'use strict';
const assert = require('assert');
const { ChildProcess } = require('child_process');
assert.strictEqual(typeof ChildProcess, 'function');
{
  const child = new ChildProcess();
  [undefined, null, 'foo', 0, 1, NaN, true, false].forEach((options) => {
    assert.throws(() => {
      child.spawn(options);
    }, {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError',
      message: 'The "options" argument must be of type object.' +
               `${common.invalidArgTypeHelper(options)}`
    });
  });
}
{
  const child = new ChildProcess();
  [undefined, null, 0, 1, NaN, true, false, {}].forEach((file) => {
    assert.throws(() => {
      child.spawn({ file });
    }, {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError',
      message: 'The "options.file" property must be of type string.' +
               `${common.invalidArgTypeHelper(file)}`
    });
  });
}
{
  const child = new ChildProcess();
  [null, 0, 1, NaN, true, false, {}, 'foo'].forEach((envPairs) => {
    assert.throws(() => {
      child.spawn({ envPairs, stdio: ['ignore', 'ignore', 'ignore', 'ipc'] });
    }, {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError',
      message: 'The "options.envPairs" property must be an instance of Array.' +
              common.invalidArgTypeHelper(envPairs)
    });
  });
}
{
  const child = new ChildProcess();
  [null, 0, 1, NaN, true, false, {}, 'foo'].forEach((args) => {
    assert.throws(() => {
      child.spawn({ file: 'foo', args });
    }, {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError',
      message: 'The "options.args" property must be an instance of Array.' +
               common.invalidArgTypeHelper(args)
    });
  });
}
const child = new ChildProcess();
child.spawn({
  file: process.execPath,
  args: ['--interactive'],
  cwd: process.cwd(),
  stdio: 'pipe'
});
assert.strictEqual(child.hasOwnProperty('pid'), true);
assert(Number.isInteger(child.pid));
assert.throws(
  () => { child.kill('foo'); },
  { code: 'ERR_UNKNOWN_SIGNAL', name: 'TypeError' }
);
assert.strictEqual(child.kill(), true);
