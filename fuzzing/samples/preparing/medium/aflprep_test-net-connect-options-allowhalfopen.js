'use strict';
const assert = require('assert');
const net = require('net');
{
  let clientReceivedFIN = 0;
  let serverConnections = 0;
  let clientSentFIN = 0;
  let serverReceivedFIN = 0;
  const host = common.localhostIPv4;
  function serverOnConnection(socket) {
    console.log(`'connection' ${++serverConnections} emitted on server`);
    const srvConn = serverConnections;
    socket.resume();
    socket.on('data', common.mustCall(function socketOnData(data) {
      this.clientId = data.toString();
      console.log(
        `server connection ${srvConn} is started by client ${this.clientId}`);
    }));
    socket.on('end', common.mustCall(function socketOnEnd() {
      console.log(`Server received FIN sent by client ${this.clientId}`);
      if (++serverReceivedFIN < CLIENT_VARIANTS) return;
      setTimeout(() => {
        server.close();
        console.log(`connection ${this.clientId} is closing the server:
          FIN ${serverReceivedFIN} received by server,
          FIN ${clientReceivedFIN} received by client
          FIN ${clientSentFIN} sent by client,
      }, 50);
    }, 1));
    socket.end();
    console.log(`Server has sent ${serverConnections} FIN`);
  }
  function clientOnConnect(index) {
    return common.mustCall(function clientOnConnectInner() {
      const client = this;
      console.log(`'connect' emitted on Client ${index}`);
      client.resume();
      client.on('end', common.mustCall(function clientOnEnd() {
        setTimeout(function closeServer() {
          console.log(`client ${index} received FIN`);
          assert(!client.readable);
          assert(client.writable);
          assert(client.write(String(index)));
          client.end();
          clientSentFIN++;
          console.log(
            `client ${index} sent FIN, ${clientSentFIN} have been sent`);
        }, 50);
      }));
      client.on('close', common.mustCall(function clientOnClose() {
        clientReceivedFIN++;
        console.log(`connection ${index} has been closed by both sides,` +
          ` ${clientReceivedFIN} clients have closed`);
      }));
    });
  }
  function serverOnClose() {
    console.log(`Server has been closed:
      FIN ${serverReceivedFIN} received by server
      FIN ${clientReceivedFIN} received by client
      FIN ${clientSentFIN} sent by client
  }
  function serverOnListen() {
    const port = server.address().port;
    console.log(`Server started listening at ${host}:${port}`);
    const opts = { allowHalfOpen: true, host, port };
    net.connect(opts, clientOnConnect(1));
    net.connect(opts).on('connect', clientOnConnect(2));
    net.createConnection(opts, clientOnConnect(3));
    net.createConnection(opts).on('connect', clientOnConnect(4));
    new net.Socket(opts).connect(opts, clientOnConnect(5));
    new net.Socket(opts).connect(opts).on('connect', clientOnConnect(6));
  }
  const CLIENT_VARIANTS = 6;
  const server = net.createServer({ allowHalfOpen: true })
    .on('connection', common.mustCall(serverOnConnection, CLIENT_VARIANTS))
    .on('close', common.mustCall(serverOnClose))
    .listen(0, host, common.mustCall(serverOnListen));
}
