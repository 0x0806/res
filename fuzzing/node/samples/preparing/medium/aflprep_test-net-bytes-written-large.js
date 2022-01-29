'use strict';
const assert = require('assert');
const net = require('net');
const N = 10000000;
{
  const server = net.createServer(common.mustCall((socket) => {
    socket.end(Buffer.alloc(N), common.mustCall(() => {
      assert.strictEqual(socket.bytesWritten, N);
    }));
    assert.strictEqual(socket.bytesWritten, N);
  })).listen(0, common.mustCall(() => {
    const client = net.connect(server.address().port);
    client.resume();
    client.on('close', common.mustCall(() => {
      assert.strictEqual(client.bytesRead, N);
      server.close();
    }));
  }));
}
{
  const server = net.createServer(common.mustCall((socket) => {
    socket.end('a'.repeat(N), common.mustCall(() => {
      assert.strictEqual(socket.bytesWritten, N);
    }));
    assert.strictEqual(socket.bytesWritten, N);
  })).listen(0, common.mustCall(() => {
    const client = net.connect(server.address().port);
    client.resume();
    client.on('close', common.mustCall(() => {
      assert.strictEqual(client.bytesRead, N);
      server.close();
    }));
  }));
}
{
  const server = net.createServer(common.mustCall((socket) => {
    socket.cork();
    socket.write('a'.repeat(N));
    assert.strictEqual(socket.bytesWritten, N);
    socket.write(Buffer.alloc(N));
    assert.strictEqual(socket.bytesWritten, 2 * N);
    socket.end('', common.mustCall(() => {
      assert.strictEqual(socket.bytesWritten, 2 * N);
    }));
    socket.uncork();
  })).listen(0, common.mustCall(() => {
    const client = net.connect(server.address().port);
    client.resume();
    client.on('close', common.mustCall(() => {
      assert.strictEqual(client.bytesRead, 2 * N);
      server.close();
    }));
  }));
}
