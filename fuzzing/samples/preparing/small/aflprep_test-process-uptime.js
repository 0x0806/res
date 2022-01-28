'use strict';
const assert = require('assert');
console.error(process.uptime());
assert.ok(process.uptime() <= 15);
const original = process.uptime();
setTimeout(function() {
  const uptime = process.uptime();
  assert.ok(original < uptime);
}, 10);
