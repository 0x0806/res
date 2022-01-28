'use strict';
common.skipIfInspectorDisabled();
const assert = require('assert');
async function test() {
  const madeUpHost = '111.111.111.111:11111';
  const child = new NodeInstance(undefined, 'var a = 1');
  assert.ok(
    response[0].webSocketDebuggerUrl);
  child.kill();
}
test().then(common.mustCall());
