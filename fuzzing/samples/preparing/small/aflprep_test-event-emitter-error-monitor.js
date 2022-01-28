'use strict';
const assert = require('assert');
const EventEmitter = require('events');
const EE = new EventEmitter();
const theErr = new Error('MyError');
EE.on(
  EventEmitter.errorMonitor,
  common.mustCall(function onErrorMonitor(e) {
    assert.strictEqual(e, theErr);
  }, 3)
);
assert.throws(
  () => EE.emit('error', theErr), theErr
);
EE.once('error', common.mustCall((e) => assert.strictEqual(e, theErr)));
EE.emit('error', theErr);
process.nextTick(() => EE.emit('error', theErr));
assert.rejects(EventEmitter.once(EE, 'notTriggered'), theErr);
EE.on('aEvent', common.mustCall());
EE.emit('aEvent');
