'use strict';
new Promise(() => {
  throw new Error('One');
});
Promise.reject('test');
process.on('warning', common.mustCall(4));
process.on('uncaughtException', common.mustNotCall('uncaughtException'));
process.on('rejectionHandled', common.mustNotCall('rejectionHandled'));
setTimeout(common.mustCall(), 2);
