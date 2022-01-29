'use strict';
const assert = require('assert');
const net = require('net');
{
  const server = net.createServer();
  assert.throws(
    () => server.listen({ port: 0, signal: 'INVALID_SIGNAL' }),
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError'
    });
}
{
  const server = net.createServer();
  const controller = new AbortController();
  server.on('close', common.mustCall());
  server.listen({ port: 0, signal: controller.signal });
  controller.abort();
}
{
  const server = net.createServer();
  const signal = AbortSignal.abort();
  server.on('close', common.mustCall());
  server.listen({ port: 0, signal });
}
