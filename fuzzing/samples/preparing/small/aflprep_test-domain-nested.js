'use strict';
const assert = require('assert');
const domain = require('domain');
process.on('exit', function(c) {
  assert.strictEqual(domain._stack.length, 0);
});
domain.create().run(function() {
  domain.create().run(function() {
    domain.create().run(function() {
      domain.create().on('error', function(e) {
      }).run(function() {
        throw new Error('died');
      });
    });
  });
});
