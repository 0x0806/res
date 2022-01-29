'use strict';
const assert = require('assert');
const { Signal } = internalBinding('signal_wrap');
assert.throws(function() {
  const s = new Signal();
  const nots = { start: s.start };
  nots.start(9);
