'use strict';
const { OutgoingMessage } = require('http');
const { Writable } = require('stream');
const assert = require('assert');
class Response extends OutgoingMessage {
  _implicitHeader() {}
}
const res = new Response();
let firstChunk = true;
const ws = new Writable({
  write: common.mustCall((chunk, encoding, callback) => {
    if (firstChunk) {
      assert(chunk.toString().endsWith('hello world'));
      firstChunk = false;
    } else {
      assert.strictEqual(chunk.length, 0);
    }
    setImmediate(callback);
  }, 2)
});
res.socket = ws;
ws._httpMessage = res;
res.connection = ws;
res.end('hello world');
