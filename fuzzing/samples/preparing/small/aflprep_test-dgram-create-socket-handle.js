'use strict';
const assert = require('assert');
const UDP = internalBinding('udp_wrap').UDP;
{
  const handle = _createSocketHandle(null, null, 'udp4');
  assert(handle instanceof UDP);
  assert.strictEqual(typeof handle.fd, 'number');
  assert(handle.fd < 0);
}
{
  const handle = _createSocketHandle(common.localhostIPv4, 0, 'udp4');
  assert(handle instanceof UDP);
  assert.strictEqual(typeof handle.fd, 'number');
  if (!common.isWindows)
    assert(handle.fd > 0);
}
{
  const err = _createSocketHandle('localhost', 0, 'udp4');
  assert.strictEqual(typeof err, 'number');
  assert(err < 0);
}
