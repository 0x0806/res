'use strict';
new Promise(() => {
  throw new Error('One');
});
Promise.reject('test');
process.on('warning', common.mustCall(4));
process.on('uncaughtException', common.mustNotCall('uncaughtException'));
process.on('rejectionHandled', common.mustCall(2));
process.on('unhandledRejection', (reason, promise) => {
  promise.catch(() => {});
});
setTimeout(common.mustCall(), 2);
