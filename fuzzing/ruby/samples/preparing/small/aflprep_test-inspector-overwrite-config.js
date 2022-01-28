'use strict';
const assert = require('assert');
if (!common.isMainThread)
  common.skip('--require does not work with Workers');
const inspector = require('inspector');
const msg = 'Test inspector logging';
let asserted = false;
async function testConsoleLog() {
  const session = new inspector.Session();
  session.connect();
  session.on('inspectorNotification', (data) => {
    if (data.method === 'Runtime.consoleAPICalled') {
      assert.strictEqual(data.params.args.length, 1);
      assert.strictEqual(data.params.args[0].value, msg);
      asserted = true;
    }
  });
  session.post('Runtime.enable');
  console.log(msg);
  session.disconnect();
}
async function runTests() {
  await testConsoleLog();
  assert.ok(asserted, 'log statement did not reach the inspector');
}
runTests().then(common.mustCall());
