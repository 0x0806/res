'use strict';
process.noDeprecation = true;
const assert = require('assert');
function listener() {
  assert.fail('received unexpected warning');
}
process.addListener('warning', listener);
process.emitWarning('Something is deprecated.', 'DeprecationWarning');
process.nextTick(common.mustCall(() => {
  process.noDeprecation = false;
  process.removeListener('warning', listener);
  process.addListener('warning', common.mustCall((warning) => {
    assert.strictEqual(warning.name, 'DeprecationWarning');
    assert.strictEqual(warning.message, 'Something else is deprecated.');
  }));
  process.emitWarning('Something else is deprecated.', 'DeprecationWarning');
}));
