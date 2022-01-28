'use strict';
const assert = require('assert');
setTimeout(() => {
  const domain = require('domain');
  const d = domain.create();
  d.run(() => {
    process.nextTick(() => {
      console.trace('in nexttick', process.domain === d);
      assert.strictEqual(process.domain, d);
    });
  });
}, 1);
