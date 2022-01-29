'use strict';
const assert = require('assert');
const fork = require('child_process').fork;
const childScript = fixtures.path('child-process-spawn-node');
const malFormedOpts = { stdio: '33' };
const payload = { hello: 'world' };
assert.throws(
  () => fork(childScript, malFormedOpts),
  { code: 'ERR_INVALID_ARG_VALUE', name: 'TypeError' });
function test(stringVariant) {
  const child = fork(childScript, { stdio: stringVariant });
  child.on('message', common.mustCall((message) => {
    assert.deepStrictEqual(message, { foo: 'bar' });
  }));
  child.send(payload);
  child.on('exit', common.mustCall((code) => assert.strictEqual(code, 0)));
}
['pipe', 'inherit', 'ignore'].forEach(test);
