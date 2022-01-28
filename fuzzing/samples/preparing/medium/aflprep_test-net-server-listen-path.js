'use strict';
const net = require('net');
const assert = require('assert');
const fs = require('fs');
tmpdir.refresh();
function closeServer() {
  return common.mustCall(function() {
    this.close();
  });
}
let counter = 0;
function randomPipePath() {
  return `${common.PIPE}-listen-path-${counter++}`;
}
{
  const handlePath = randomPipePath();
  net.createServer()
    .listen(handlePath)
    .on('listening', closeServer());
}
{
  const handlePath = randomPipePath();
  net.createServer()
    .listen({ path: handlePath })
    .on('listening', closeServer());
}
{
  const handlePath = randomPipePath();
  net.createServer()
    .listen(handlePath, closeServer());
}
{
  const handlePath = randomPipePath();
  net.createServer()
    .listen({ path: handlePath }, closeServer());
}
{
  const handlePath = randomPipePath();
  const server = net.createServer()
    .listen({
      path: handlePath,
      readableAll: true,
      writableAll: true
    }, common.mustCall(() => {
      if (process.platform !== 'win32') {
        const mode = fs.statSync(handlePath).mode;
        assert.notStrictEqual(mode & fs.constants.S_IROTH, 0);
        assert.notStrictEqual(mode & fs.constants.S_IWOTH, 0);
      }
      server.close();
    }));
}
{
  const handlePath = randomPipePath();
  const server1 = net.createServer().listen({ path: handlePath }, () => {
    const server2 = net.createServer()
      .listen({
        path: handlePath,
        writableAll: true,
      }, common.mustNotCall());
    server2.on('error', common.mustCall((err) => {
      server1.close();
      assert.strictEqual(err.code, 'EADDRINUSE');
    }));
  });
}
