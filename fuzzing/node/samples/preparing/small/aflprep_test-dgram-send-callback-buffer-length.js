'use strict';
const assert = require('assert');
const dgram = require('dgram');
const client = dgram.createSocket('udp4');
const buf = Buffer.allocUnsafe(256);
const offset = 20;
const len = buf.length - offset;
const messageSent = common.mustSucceed(function messageSent(bytes) {
  assert.notStrictEqual(bytes, buf.length);
  assert.strictEqual(bytes, buf.length - offset);
  client.close();
});
client.bind(0, () => client.send(buf, offset, len,
                                 client.address().port,
                                 '127.0.0.1',
                                 messageSent));
