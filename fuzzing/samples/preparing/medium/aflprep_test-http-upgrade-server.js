'use strict';
const assert = require('assert');
const net = require('net');
const http = require('http');
let requests_recv = 0;
let requests_sent = 0;
let request_upgradeHead = null;
function createTestServer() {
  return new testServer();
}
function testServer() {
  http.Server.call(this, () => {});
  this.on('connection', function() {
    requests_recv++;
  });
  this.on('request', function(req, res) {
    res.write('okay');
    res.end();
  });
  this.on('upgrade', function(req, socket, upgradeHead) {
                 'Upgrade: WebSocket\r\n' +
                 'Connection: Upgrade\r\n' +
                 '\r\n\r\n');
    request_upgradeHead = upgradeHead;
    socket.on('data', function(d) {
      const data = d.toString('utf8');
      if (data === 'kill') {
        socket.end();
      } else {
        socket.write(data, 'utf8');
      }
    });
  });
}
Object.setPrototypeOf(testServer.prototype, http.Server.prototype);
Object.setPrototypeOf(testServer, http.Server);
function writeReq(socket, data, encoding) {
  requests_sent++;
  socket.write(data);
}
function test_upgrade_with_listener() {
  const conn = net.createConnection(server.address().port);
  conn.setEncoding('utf8');
  let state = 0;
  conn.on('connect', function() {
    writeReq(conn,
             'Upgrade: WebSocket\r\n' +
             'Connection: Upgrade\r\n' +
             '\r\n' +
             'WjN}|M(6');
  });
  conn.on('data', function(data) {
    state++;
    assert.strictEqual(typeof data, 'string');
    if (state === 1) {
      assert.strictEqual(request_upgradeHead.toString('utf8'), 'WjN}|M(6');
      conn.write('test', 'utf8');
    } else if (state === 2) {
      assert.strictEqual(data, 'test');
      conn.write('kill', 'utf8');
    }
  });
  conn.on('end', function() {
    assert.strictEqual(state, 2);
    conn.end();
    server.removeAllListeners('upgrade');
    test_upgrade_no_listener();
  });
}
function test_upgrade_no_listener() {
  const conn = net.createConnection(server.address().port);
  conn.setEncoding('utf8');
  conn.on('connect', function() {
    writeReq(conn,
             'Upgrade: WebSocket\r\n' +
             'Connection: Upgrade\r\n' +
             '\r\n');
  });
  conn.once('data', (data) => {
    assert.strictEqual(typeof data, 'string');
    conn.end();
  });
  conn.on('close', function() {
    test_standard_http();
  });
}
function test_standard_http() {
  const conn = net.createConnection(server.address().port);
  conn.setEncoding('utf8');
  conn.on('connect', function() {
  });
  conn.once('data', function(data) {
    assert.strictEqual(typeof data, 'string');
    conn.end();
  });
  conn.on('close', function() {
    server.close();
  });
}
const server = createTestServer();
server.listen(0, function() {
  test_upgrade_with_listener();
});
process.on('exit', function() {
  assert.strictEqual(requests_recv, 3);
  assert.strictEqual(requests_sent, 3);
});
