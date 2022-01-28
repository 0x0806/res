'use strict';
const assert = require('assert');
let b = 0;
process.on('warning', common.mustCall((warning) => {
  switch (b++) {
    case 0:
      assert.strictEqual(warning.message, 'This was rejected');
      break;
    case 1:
      assert.strictEqual(warning.name, 'UnhandledPromiseRejectionWarning');
      assert(
        'Expected warning message to contain "Unhandled promise rejection" ' +
        `but did not. Had "${warning.message}" instead.`
      );
      break;
    case 2:
      assert.strictEqual(warning.message, '42');
      break;
    case 3:
      assert.strictEqual(warning.name, 'UnhandledPromiseRejectionWarning');
      assert(
        'Expected warning message to contain "Unhandled promise rejection" ' +
        `but did not. Had "${warning.message}" instead.`
      );
      break;
    case 4:
      assert.strictEqual(warning.name, 'PromiseRejectionHandledWarning');
        .test(warning.message));
  }
}, 5));
setImmediate(common.mustCall(() => p.catch(() => { })));
