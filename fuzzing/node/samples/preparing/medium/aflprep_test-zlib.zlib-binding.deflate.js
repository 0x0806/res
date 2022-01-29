'use strict';
const assert = require('assert');
const hooks = initHooks();
hooks.enable();
const { Zlib } = internalBinding('zlib');
const constants = require('zlib').constants;
const handle = new Zlib(constants.DEFLATE);
const as = hooks.activitiesOfTypes('ZLIB');
assert.strictEqual(as.length, 1);
const hdl = as[0];
assert.strictEqual(hdl.type, 'ZLIB');
assert.strictEqual(typeof hdl.uid, 'number');
assert.strictEqual(typeof hdl.triggerAsyncId, 'number');
checkInvocations(hdl, { init: 1 }, 'when created handle');
const buffers = {
  writeResult: new Uint32Array(2),
  dictionary: new Uint8Array(0),
  inBuf: new Uint8Array([0x78]),
  outBuf: new Uint8Array(1)
};
handle.init(
  constants.Z_DEFAULT_WINDOWBITS,
  constants.Z_MIN_LEVEL,
  constants.Z_DEFAULT_MEMLEVEL,
  constants.Z_DEFAULT_STRATEGY,
  buffers.writeResult,
  function processCallback() { this.cb(); },
  buffers.dictionary
);
checkInvocations(hdl, { init: 1 }, 'when initialized handle');
let count = 2;
handle.cb = common.mustCall(onwritten, 2);
handle.write(true, buffers.inBuf, 0, 1, buffers.outBuf, 0, 1);
checkInvocations(hdl, { init: 1 }, 'when invoked write() on handle');
function onwritten() {
  if (--count) {
    checkInvocations(hdl, { init: 1, before: 1 },
                     'when wrote to handle the first time');
    handle.write(true, buffers.inBuf, 0, 1, buffers.outBuf, 0, 1);
  } else {
    checkInvocations(hdl, { init: 1, before: 2, after: 1 },
                     'when wrote to handle the second time');
  }
}
process.on('exit', onexit);
function onexit() {
  hooks.disable();
  hooks.sanityCheck('ZLIB');
  checkInvocations(hdl, { init: 1, before: 2, after: 2 }, 'when process exits');
  buffers.buffers = buffers;
}
