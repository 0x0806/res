'use strict';
if (!common.hasCrypto) common.skip('missing crypto');
const net = require('net');
const assert = require('assert');
const tls = require('tls');
tls.DEFAULT_MAX_VERSION = 'TLSv1.3';
const CONTENT = 'Hello World';
const tlsServer = tls.createServer(
  {
    key: fixtures.readKey('rsa_private.pem'),
    cert: fixtures.readKey('rsa_cert.crt'),
    ca: [fixtures.readKey('rsa_ca.crt')],
  },
  (socket) => {
    socket.on('close', common.mustCall());
    socket.write(CONTENT);
    socket.destroy();
    socket.on('error', (err) => {
      if (err.code === 'ERR_STREAM_DESTROYED')
        return;
      assert.ifError(err);
    });
  },
);
const server = net.createServer((conn) => {
  conn.on('error', common.mustNotCall());
  conn.once('data', common.mustCall((chunk) => {
    const { clientSide, serverSide } = makeDuplexPair();
    serverSide.on('close', common.mustCall(() => {
      conn.destroy();
    }));
    clientSide.pipe(conn);
    conn.pipe(clientSide);
    conn.on('close', common.mustCall(() => {
      clientSide.destroy();
    }));
    clientSide.on('close', common.mustCall(() => {
      conn.destroy();
    }));
    process.nextTick(() => {
      conn.unshift(chunk);
    });
    tlsServer.emit('connection', serverSide);
  }));
});
server.listen(0, () => {
  const port = server.address().port;
  const conn = tls.connect({ port, rejectUnauthorized: false }, () => {
    conn.on('data', (data) => {
      assert.strictEqual(data.toString('utf8'), CONTENT);
    });
    conn.on('error', common.mustNotCall());
    conn.on('close', common.mustCall(() => server.close()));
  });
});
