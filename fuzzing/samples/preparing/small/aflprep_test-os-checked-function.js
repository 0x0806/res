'use strict';
const assert = require('assert');
internalBinding('os').getHomeDirectory = function(ctx) {
  ctx.syscall = 'foo';
  ctx.code = 'bar';
  ctx.message = 'baz';
};
const os = require('os');
assert.throws(os.homedir, {
});
