'use strict';
const assert = require('assert');
const dgram = require('dgram');
{
  assert.throws(
    () => dgram.createSocket({ type: 'udp4', signal: {} }),
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError'
    });
}
{
  const controller = new AbortController();
  const { signal } = controller;
  const server = dgram.createSocket({ type: 'udp4', signal });
  server.on('close', common.mustCall());
  controller.abort();
}
{
  const signal = AbortSignal.abort();
  const server = dgram.createSocket({ type: 'udp4', signal });
  server.on('close', common.mustCall());
}
