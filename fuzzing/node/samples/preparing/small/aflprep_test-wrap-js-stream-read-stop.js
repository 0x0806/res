'use strict';
const assert = require('assert');
const Stream = require('stream');
class FakeStream extends Stream {
  constructor() {
    super();
    this._paused = false;
  }
  pause() {
    this._paused = true;
  }
  resume() {
    this._paused = false;
  }
  isPaused() {
    return this._paused;
  }
}
const fakeStreamObj = new FakeStream();
const wrappedStream = new WrapStream(fakeStreamObj);
assert.strictEqual(fakeStreamObj.isPaused(), false);
fakeStreamObj.pause();
assert.strictEqual(fakeStreamObj.isPaused(), true);
fakeStreamObj.resume();
assert.strictEqual(wrappedStream.readStop(), 0);
assert.strictEqual(fakeStreamObj.isPaused(), true);
