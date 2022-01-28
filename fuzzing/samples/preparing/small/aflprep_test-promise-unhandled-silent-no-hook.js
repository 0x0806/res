'use strict';
const assert = require('assert');
new Promise(() => {
  throw new Error('One');
});
Promise.reject('test');
process.on('warning', common.mustNotCall('warning'));
process.on('uncaughtException', common.mustNotCall('uncaughtException'));
process.on('exit', assert.strictEqual.bind(null, 0));
setTimeout(common.mustCall(), 2);
