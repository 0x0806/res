'use strict';
const assert = require('assert');
const net = require('net');
{
  const dummyServer = net.Server();
  const server = net.Server();
  dummyServer.listen(common.mustCall(() => {
    server.listen(dummyServer.address().port);
  }));
  server.on('error', common.mustCall((e) => {
    server.listen(common.mustCall(() => {
      dummyServer.close();
      server.close();
    }));
  }));
}
{
  const server = net.Server();
  server.listen(common.mustCall(() => server.close()));
  assert.throws(() => server.listen(), {
    code: 'ERR_SERVER_ALREADY_LISTEN',
    name: 'Error'
  });
}
{
  const server = net.Server();
  server.listen(common.mustCall(() => {
    server.close();
    server.listen(common.mustCall(() => server.close()));
  }));
}
