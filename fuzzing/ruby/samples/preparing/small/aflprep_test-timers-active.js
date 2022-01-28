'use strict';
const assert = require('assert');
const active = require('timers').active;
const legitTimers = [
  { _idleTimeout: 0 },
  { _idleTimeout: 1 },
];
legitTimers.forEach(function(legit) {
  const savedTimeout = legit._idleTimeout;
  active(legit);
  assert.strictEqual(legit._idleTimeout, savedTimeout);
  assert(Number.isInteger(legit._idleStart));
  assert(legit._idleNext);
  assert(legit._idlePrev);
});
const bogusTimers = [
  { _idleTimeout: -1 },
  { _idleTimeout: undefined },
];
bogusTimers.forEach(function(bogus) {
  const savedTimeout = bogus._idleTimeout;
  active(bogus);
  assert.deepStrictEqual(bogus, { _idleTimeout: savedTimeout });
});
