'use strict';
const { strictEqual, throws, equal } = require('assert');
{
  const type = 'foo';
  const target = new EventTarget();
  target.addEventListener(type, common.mustCall((evt) => {
    strictEqual(evt.type, type);
  }));
  target.dispatchEvent(new Event(type));
}
{
  throws(() => {
    new Event();
  }, TypeError);
}
{
  const event = new Event('foo');
  equal(event.type, 'foo');
  equal(event.bubbles, false);
  equal(event.cancelable, false);
  equal(event.detail, null);
}
