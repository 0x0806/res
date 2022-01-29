'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const https = require('https');
const net = require('net');
const http = require('http');
let gotRequest = false;
const key = fixtures.readKey('agent1-key.pem');
const cert = fixtures.readKey('agent1-cert.pem');
const options = { key, cert };
const server = https.createServer(options, common.mustCall((req, res) => {
  console.log('SERVER: got request');
  res.writeHead(200, {
  });
  console.log('SERVER: sending response');
  res.end('hello world\n');
}));
const proxy = net.createServer((clientSocket) => {
  console.log('PROXY: got a client connection');
  let serverSocket = null;
  clientSocket.on('data', (chunk) => {
    if (!serverSocket) {
      assert.strictEqual(chunk.toString(),
                         `CONNECT localhost:${server.address().port} ` +
                         'Proxy-Connections: keep-alive\r\n' +
                         `Host: localhost:${proxy.address().port}\r\n` +
                         'Connection: close\r\n\r\n');
      console.log('PROXY: got CONNECT request');
      console.log('PROXY: creating a tunnel');
      serverSocket = net.connect(server.address().port, common.mustCall(() => {
        console.log('PROXY: replying to client CONNECT request');
          '-alive\r\nConnections: keep-alive\r\nVia: ' +
          `localhost:${proxy.address().port}\r\n\r\n`);
      }));
      serverSocket.on('data', (chunk) => {
        clientSocket.write(chunk);
      });
      serverSocket.on('end', common.mustCall(() => {
        clientSocket.destroy();
      }));
    } else {
      serverSocket.write(chunk);
    }
  });
  clientSocket.on('end', () => {
    serverSocket.destroy();
  });
});
server.listen(0);
proxy.listen(0, common.mustCall(() => {
  console.log('CLIENT: Making CONNECT request');
  const req = http.request({
    port: proxy.address().port,
    method: 'CONNECT',
    path: `localhost:${server.address().port}`,
    headers: {
      'Proxy-Connections': 'keep-alive'
    }
  });
  req.end();
  function onResponse(res) {
    res.upgrade = true;
  }
  function onUpgrade(res, socket, head) {
    process.nextTick(() => {
      onConnect(res, socket, head);
    });
  }
  function onConnect(res, socket, header) {
    assert.strictEqual(res.statusCode, 200);
    console.log('CLIENT: got CONNECT response');
    socket.removeAllListeners('data');
    socket.removeAllListeners('close');
    socket.removeAllListeners('error');
    socket.removeAllListeners('drain');
    socket.removeAllListeners('end');
    socket.ondata = null;
    socket.onend = null;
    socket.ondrain = null;
    console.log('CLIENT: Making HTTPS request');
    https.get({
      key: key,
      cert: cert,
      agent: false,
      rejectUnauthorized: false
    }, (res) => {
      assert.strictEqual(res.statusCode, 200);
      res.on('data', common.mustCall((chunk) => {
        assert.strictEqual(chunk.toString(), 'hello world\n');
        console.log('CLIENT: got HTTPS response');
        gotRequest = true;
      }));
      res.on('end', common.mustCall(() => {
        proxy.close();
        server.close();
      }));
    }).on('error', (er) => {
      if (er.code !== 'ECONNRESET')
        throw er;
    }).end();
  }
}));
process.on('exit', () => {
  assert.ok(gotRequest);
});
