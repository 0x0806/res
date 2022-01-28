'use strict';
const assert = require('assert');
const domain = require('domain');
process.on('warning', common.mustNotCall());
const d = new domain.Domain();
d.on('error', common.mustCall(function(er) {
  console.error('caught', er);
  assert.strictEqual(er.domain, d);
  assert.strictEqual(er.domainThrown, true);
  assert.ok(!er.domainEmitter);
  assert.strictEqual(er.actual.code, 'ENOENT');
  assert.strictEqual(typeof er.actual.errno, 'number');
}));
d.run(function() {
  setTimeout(function() {
    const fs = require('fs');
    fs.readdir(__dirname, function() {
      fs.open('this file does not exist', 'r', function(er) {
        assert.ifError(er);
        throw new Error('should not get here!');
      });
    });
  }, 100);
});
