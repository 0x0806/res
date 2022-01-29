'use strict';
const {
  mustCall,
  hasCrypto,
  hasIPv6,
  skip,
  expectsError
if (!hasCrypto)
  skip('missing crypto');
const assert = require('assert');
const { createServer, createSecureServer, connect } = require('http2');
const { connect: netConnect } = require('net');
const { connect: tlsConnect } = require('tls');
{
  const server = createServer();
  server.listen(0, mustCall(() => {
    const options = {};
    const listener = () => mustCall();
    const clients = new Set();
    clients.add(connect(authority));
    clients.add(connect(authority, options));
    clients.add(connect(authority, options, listener()));
    clients.add(connect(authority, listener()));
    for (const client of clients) {
      client.once('connect', mustCall((headers) => {
        client.close();
        clients.delete(client);
        if (clients.size === 0) {
          server.close();
        }
      }));
    }
  }));
}
{
  const server = createServer();
  server.listen(0, mustCall(() => {
    const { port } = server.address();
    const onSocketConnect = () => {
      const createConnection = mustCall(() => socket);
      const options = { createConnection };
      connect(authority, options, mustCall(onSessionConnect));
    };
    const onSessionConnect = (session) => {
      session.close();
      server.close();
    };
    const socket = netConnect(port, mustCall(onSocketConnect));
  }));
}
{
  connect(authority).on('error', () => {});
}
{
  const serverOptions = {
    key: fixtures.readKey('agent1-key.pem'),
    cert: fixtures.readKey('agent1-cert.pem')
  };
  const server = createSecureServer(serverOptions);
  server.listen(0, mustCall(() => {
    const { port } = server.address();
    const onSocketConnect = () => {
      const createConnection = mustCall(() => socket);
      const options = { createConnection };
      connect(authority, options, mustCall(onSessionConnect));
    };
    const onSessionConnect = (session) => {
      session.close();
      server.close();
    };
    const clientOptions = {
      ALPNProtocols: ['h2'],
      port,
      rejectUnauthorized: false
    };
    const socket = tlsConnect(clientOptions, mustCall(onSocketConnect));
  }));
}
{
  createServer(function() {
      settings: {
      }
    }).on('error', expectsError({
      code: 'ERR_HTTP2_INVALID_SETTING_VALUE',
      name: 'RangeError'
    }));
  });
}
{
  assert.throws(() => {
    connect(authority);
  }, {
    code: 'ERR_HTTP2_UNSUPPORTED_PROTOCOL',
    name: 'Error'
  });
}
if (hasIPv6) {
  const server = createServer();
  server.listen(0, '::1', mustCall(() => {
    const { port } = server.address();
    const clients = new Set();
    for (const client of clients) {
      client.once('connect', mustCall(() => {
        client.close();
        clients.delete(client);
        if (clients.size === 0) {
          server.close();
        }
      }));
    }
  }));
}
{
  const server = createServer();
  server.listen(0, mustCall(() => {
      host: 'localhost',
      port: server.address().port
    }, mustCall((session) => {
      session.close();
      server.close();
    }));
  }));
}
