'use strict';
const vm = require('vm');
const assert = require('assert');
if (new Error().stack.includes('node_modules'))
  common.skip('test does not work when inside `node_modules` directory');
if (process.env.NODE_PENDING_DEPRECATION)
  common.skip('test does not work when NODE_PENDING_DEPRECATION is set');
const bufferWarning = 'Buffer() is deprecated due to security and usability ' +
                      'issues. Please use the Buffer.alloc(), ' +
                      'Buffer.allocUnsafe(), or Buffer.from() methods instead.';
process.addListener('warning', common.mustCall((warning) => {
  assert(warning.stack.includes('this_should_emit_a_warning'), warning.stack);
}));
vm.runInNewContext('new Buffer(10)', { Buffer }, {
});
common.expectWarning('DeprecationWarning', bufferWarning, 'DEP0005');
vm.runInNewContext('new Buffer(10)', { Buffer }, {
});
