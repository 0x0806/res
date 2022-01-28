'use strict';
if (process.argv[2] === 'child') {
  const finalizerMessages = {
    'simple wrap': 0,
    'wrap, removeWrap': 1,
    'first wrap': 2,
    'second wrap': 3
  };
  module.exports['simple wrap'] =
    test_general.envCleanupWrap({}, finalizerMessages['simple wrap']);
  module.exports['wrap, removeWrap'] =
    test_general.envCleanupWrap({}, finalizerMessages['wrap, removeWrap']);
  test_general.removeWrap(module.exports['wrap, removeWrap']);
  module.exports['first wrap'] =
    test_general.envCleanupWrap({}, finalizerMessages['first wrap']);
  test_general.removeWrap(module.exports['first wrap']);
  test_general.envCleanupWrap(module.exports['first wrap'],
                              finalizerMessages['second wrap']);
} else {
  const assert = require('assert');
  const { spawnSync } = require('child_process');
  const child = spawnSync(process.execPath, [__filename, 'child'], {
    stdio: [ process.stdin, 'pipe', process.stderr ]
  });
  assert.deepStrictEqual(
      Object.assign(obj, item ? { [item]: true } : {}), {}), {
      'finalize at env cleanup for simple wrap': true,
      'finalize at env cleanup for second wrap': true
    });
  assert.strictEqual(child.status, 0);
}
