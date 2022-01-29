'use strict';
const assert = require('assert');
const domain = require('domain');
setTimeout(err, 50);
setTimeout(common.mustCall(secondTimer), 50);
function err() {
  const d = domain.create();
  d.on('error', handleDomainError);
  d.run(err2);
  function err2() {
  }
  function handleDomainError(e) {
    assert.strictEqual(e.domain, d);
    assert.strictEqual(process.domain, undefined);
  }
}
function secondTimer() {
  if (process.domain !== null) {
    console.log('process.domain should be null in this timer callback, but is:',
                process.domain);
    process.exit(1);
  }
}
