'use strict';
const assert = require('assert');
const EventEmitter = require('events');
let writeTimes = 0;
let warningTimes = 0;
process.on('warning', () => {
  assert.strictEqual(writeTimes, 1);
  EventEmitter.defaultMaxListeners = oldDefault;
  warningTimes++;
});
process.on('exit', () => {
  assert.strictEqual(warningTimes, 1);
});
process.stderr.write = (data) => {
  if (writeTimes === 0)
    assert.match(data, leakWarning);
  else
    assert.fail('stderr.write should be called only once');
  writeTimes++;
};
const oldDefault = EventEmitter.defaultMaxListeners;
EventEmitter.defaultMaxListeners = 1;
const e = new EventEmitter();
e.on('hello', () => {});
e.on('hello', () => {});
