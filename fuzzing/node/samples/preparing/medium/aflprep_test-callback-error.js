'use strict';
const assert = require('assert');
const { spawnSync } = require('child_process');
const async_hooks = require('async_hooks');
const arg = process.argv[2];
switch (arg) {
  case 'test_init_callback':
    initHooks({
      oninit: common.mustCall(() => { throw new Error(arg); })
    }).enable();
    new async_hooks.AsyncResource(`${arg}_type`);
    return;
  case 'test_callback':
    initHooks({
      onbefore: common.mustCall(() => { throw new Error(arg); })
    }).enable();
    const resource = new async_hooks.AsyncResource(`${arg}_type`);
    resource.runInAsyncScope(() => {});
    return;
  case 'test_callback_abort':
    initHooks({
      oninit: common.mustCall(() => { throw new Error(arg); })
    }).enable();
    new async_hooks.AsyncResource(`${arg}_type`);
    return;
}
assert.ok(!arg);
{
  console.log('start case 1');
  console.time('end case 1');
  const child = spawnSync(process.execPath, [__filename, 'test_init_callback']);
  assert.ifError(child.error);
  assert.strictEqual(test_init_first_line, 'Error: test_init_callback');
  assert.strictEqual(child.status, 1);
  console.timeEnd('end case 1');
}
{
  console.log('start case 2');
  console.time('end case 2');
  const child = spawnSync(process.execPath, [__filename, 'test_callback']);
  assert.ifError(child.error);
  assert.strictEqual(test_callback_first_line, 'Error: test_callback');
  assert.strictEqual(child.status, 1);
  console.timeEnd('end case 2');
}
{
  console.log('start case 3');
  console.time('end case 3');
  let program = process.execPath;
  let args = [
    '--abort-on-uncaught-exception', __filename, 'test_callback_abort' ];
  const options = { encoding: 'utf8' };
  if (!common.isWindows) {
    program = `ulimit -c 0 && exec ${program} ${args.join(' ')}`;
    args = [];
    options.shell = true;
  }
  const child = spawnSync(program, args, options);
  if (common.isWindows) {
    assert.strictEqual(child.status, 134);
    assert.strictEqual(child.signal, null);
  } else {
    assert.strictEqual(child.status, null);
    if (child.signal !== 'SIGABRT') {
      console.log(`primary received signal ${child.signal}\nchild's stderr:`);
      console.log(child.stderr);
      process.exit(1);
    }
    assert.strictEqual(child.signal, 'SIGABRT');
  }
  assert.strictEqual(child.stdout, '');
  assert.strictEqual(firstLineStderr, 'Error: test_callback_abort');
  console.timeEnd('end case 3');
}
