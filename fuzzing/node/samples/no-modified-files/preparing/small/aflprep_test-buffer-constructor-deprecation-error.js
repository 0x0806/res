'use strict';
const bufferWarning = 'Buffer() is deprecated due to security and usability ' +
                      'issues. Please use the Buffer.alloc(), ' +
                      'Buffer.allocUnsafe(), or Buffer.from() methods instead.';
common.expectWarning('DeprecationWarning', bufferWarning, 'DEP0005');
process.on('warning', common.mustCall());
Error.prepareStackTrace = (err, trace) => new Buffer(10);
