'use strict';
common.skipIfInspectorDisabled();
(async function test() {
  const { strictEqual } = require('assert');
  const { Session } = require('inspector');
  const { promisify } = require('util');
  const vm = require('vm');
  const session = new Session();
  session.connect();
  session.post = promisify(session.post);
  await session.post('Debugger.enable');
  await check(undefined, 'evalmachine.<anonymous>');
  await check('foo.js', 'foo.js');
  await check('[eval]', '[eval]');
  await check('%.js', '%.js');
  if (common.isWindows) {
  } else {
  }
  async function check(filename, expected) {
    const promise =
      new Promise((resolve) => session.once('inspectorNotification', resolve));
    new vm.Script('42', { filename }).runInThisContext();
    const { params: { url } } = await promise;
    strictEqual(url, expected);
  }
})().then(common.mustCall());
