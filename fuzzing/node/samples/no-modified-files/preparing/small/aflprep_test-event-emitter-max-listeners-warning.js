'use strict';
const events = require('events');
const assert = require('assert');
class FakeInput extends events.EventEmitter {
  resume() {}
  pause() {}
  write() {}
  end() {}
}
const e = new FakeInput();
e.setMaxListeners(1);
process.on('warning', common.mustCall((warning) => {
  assert.ok(warning instanceof Error);
  assert.strictEqual(warning.name, 'MaxListenersExceededWarning');
  assert.strictEqual(warning.emitter, e);
  assert.strictEqual(warning.count, 2);
  assert.strictEqual(warning.type, 'event-type');
  assert.ok(warning.message.includes(
    '2 event-type listeners added to [FakeInput].'));
}));
e.on('event-type', () => {});
