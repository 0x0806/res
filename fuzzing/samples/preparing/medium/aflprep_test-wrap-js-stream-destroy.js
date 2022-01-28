'use strict';
const net = require('net');
{
  let port;
  const server = net.createServer((socket) => {
    socket.on('error', common.mustNotCall());
    socket.on('end', common.mustNotCall());
    socket.on('close', common.mustCall());
    socket.destroy();
  });
  server.listen(() => {
    port = server.address().port;
    createSocket();
  });
  function createSocket() {
    let streamWrap;
    const socket = new net.connect({
      port,
    }, () => {
      socket.on('error', common.mustNotCall());
      socket.on('end', common.mustCall());
      socket.on('close', common.mustCall());
      streamWrap.on('error', common.mustNotCall());
      streamWrap.on('end', common.mustCall());
      streamWrap.on('close', common.mustCall(() => {
        server.close();
      }));
    });
    streamWrap = new StreamWrap(socket);
  }
}
{
  let port;
  const server = net.createServer((socket) => {
    socket.on('error', common.mustNotCall());
    socket.on('end', common.mustCall());
    socket.on('close', common.mustCall(() => {
      server.close();
    }));
  });
  server.listen(() => {
    port = server.address().port;
    createSocket();
  });
  function createSocket() {
    let streamWrap;
    const socket = new net.connect({
      port,
    }, () => {
      socket.on('error', common.mustNotCall());
      socket.on('end', common.mustNotCall());
      socket.on('close', common.mustCall());
      streamWrap.on('error', common.mustNotCall());
      streamWrap.on('end', common.mustNotCall());
      streamWrap.on('close', common.mustCall());
      streamWrap.destroy();
    });
    streamWrap = new StreamWrap(socket);
  }
}
{
  let port;
  const server = net.createServer((socket) => {
    socket.on('error', common.mustNotCall());
    socket.on('end', common.mustCall());
    socket.on('close', common.mustCall(() => {
      server.close();
    }));
  });
  server.listen(() => {
    port = server.address().port;
    createSocket();
  });
  function createSocket() {
    let streamWrap;
    const socket = new net.connect({
      port,
    }, () => {
      socket.on('error', common.mustNotCall());
      socket.on('end', common.mustNotCall());
      socket.on('close', common.mustCall());
      streamWrap.on('error', common.mustNotCall());
      streamWrap.on('end', common.mustNotCall());
      streamWrap.on('close', common.mustCall());
      socket.destroy();
    });
    streamWrap = new StreamWrap(socket);
  }
}
