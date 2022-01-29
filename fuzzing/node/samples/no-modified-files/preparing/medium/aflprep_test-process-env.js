'use strict';
const assert = require('assert');
if (process.argv[2] === 'you-are-the-child') {
  assert.strictEqual('NODE_PROCESS_ENV_DELETED' in process.env, false);
  assert.strictEqual(process.env.NODE_PROCESS_ENV, '42');
  assert.strictEqual(process.env.hasOwnProperty, 'asdf');
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  const has = hasOwnProperty.call(process.env, 'hasOwnProperty');
  assert.strictEqual(has, true);
  process.exit(0);
}
{
  const spawn = require('child_process').spawn;
  assert.strictEqual(Object.prototype.hasOwnProperty,
                     process.env.hasOwnProperty);
  const has = process.env.hasOwnProperty('hasOwnProperty');
  assert.strictEqual(has, false);
  process.env.hasOwnProperty = 'asdf';
  process.env.NODE_PROCESS_ENV = 42;
  assert.strictEqual(process.env.NODE_PROCESS_ENV, '42');
  process.env.NODE_PROCESS_ENV_DELETED = 42;
  assert.strictEqual('NODE_PROCESS_ENV_DELETED' in process.env, true);
  delete process.env.NODE_PROCESS_ENV_DELETED;
  assert.strictEqual('NODE_PROCESS_ENV_DELETED' in process.env, false);
  const child = spawn(process.argv[0], [process.argv[1], 'you-are-the-child']);
  child.stdout.on('data', function(data) { console.log(data.toString()); });
  child.stderr.on('data', function(data) { console.log(data.toString()); });
  child.on('exit', function(statusCode) {
    if (statusCode !== 0) {
    }
  });
}
delete process.env.NON_EXISTING_VARIABLE;
assert(delete process.env.NON_EXISTING_VARIABLE);
process.env.TEST = 'test';
assert.strictEqual(process.env.TEST, 'test');
if (common.isWindows) {
  assert.strictEqual(process.env.test, 'test');
  assert.strictEqual(process.env.teST, 'test');
} else {
  assert.strictEqual(process.env.test, undefined);
  assert.strictEqual(process.env.teST, undefined);
}
{
  const keys = Object.keys(process.env);
  assert.ok(keys.length > 0);
}
{
  process.env[''] = '';
  assert.strictEqual(process.env[''], undefined);
}
