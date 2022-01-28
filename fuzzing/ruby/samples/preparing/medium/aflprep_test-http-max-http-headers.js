'use strict';
const assert = require('assert');
const http = require('http');
const net = require('net');
console.log('pid is', process.pid);
console.log('max header size is', getOptionValue('--max-http-header-size'));
function once(cb) {
  let called = false;
  return () => {
    if (!called) {
      called = true;
      cb();
    }
  };
}
function finished(client, callback) {
  ['abort', 'error', 'end'].forEach((e) => {
    client.on(e, once(() => setImmediate(callback)));
  });
}
function fillHeaders(headers, currentSize, valid = false) {
  headers += 'a'.repeat(MAX - currentSize);
  if (valid) {
    headers = headers.slice(0, -1);
  }
  return headers + '\r\n\r\n';
}
function writeHeaders(socket, headers) {
  const array = [];
  const chunkSize = 100;
  let last = 0;
    const current = (i + 1) * chunkSize;
    array.push(headers.slice(last, current));
    last = current;
  }
  assert.strictEqual(array.join(''), headers);
  next();
  function next() {
    if (socket.destroyed) {
      console.log('socket was destroyed early, data left to write:',
                  array.join('').length);
      return;
    }
    const chunk = array.shift();
    if (chunk) {
      console.log('writing chunk of size', chunk.length);
      socket.write(chunk, next);
    } else {
      socket.end();
    }
  }
}
function test1() {
  console.log('test1');
  let headers =
    'Content-Length: 0\r\n' +
    'X-CRASH: ';
  const currentSize = 2 + 14 + 1 + 7;
  headers = fillHeaders(headers, currentSize);
  const server = net.createServer((sock) => {
    sock.once('data', () => {
      writeHeaders(sock, headers);
      sock.resume();
    });
    sock.on('error', () => {});
  });
  server.listen(0, common.mustCall(() => {
    const port = server.address().port;
    const client = http.get({ port: port }, common.mustNotCall());
    client.on('error', common.mustCall((err) => {
      assert.strictEqual(err.code, 'HPE_HEADER_OVERFLOW');
      server.close(test2);
    }));
  }));
}
const test2 = common.mustCall(() => {
  console.log('test2');
  let headers =
    'Host: localhost\r\n' +
    'Agent: nod2\r\n' +
    'X-CRASH: ';
  const currentSize = 1 + 4 + 9 + 5 + 4 + 7;
  headers = fillHeaders(headers, currentSize);
  const server = http.createServer(common.mustNotCall());
  server.once('clientError', common.mustCall((err) => {
    assert.strictEqual(err.code, 'HPE_HEADER_OVERFLOW');
  }));
  server.listen(0, common.mustCall(() => {
    const client = net.connect(server.address().port);
    client.on('connect', () => {
      writeHeaders(client, headers);
      client.resume();
    });
    finished(client, common.mustCall(() => {
      server.close(test3);
    }));
  }));
});
const test3 = common.mustCall(() => {
  console.log('test3');
  let headers =
    'Host: localhost\r\n' +
    'Agent: nod3\r\n' +
    'X-CRASH: ';
  const currentSize = 1 + 4 + 9 + 5 + 4 + 7;
  headers = fillHeaders(headers, currentSize, true);
  console.log('writing', headers.length);
  const server = http.createServer(common.mustCall((req, res) => {
    res.end('hello from test3 server');
    server.close();
  }));
  server.on('clientError', (err) => {
    console.log(err.code);
    if (err.code === 'HPE_HEADER_OVERFLOW') {
      console.log(err.rawPacket.toString('hex'));
    }
  });
  server.on('clientError', common.mustNotCall());
  server.listen(0, common.mustCall(() => {
    const client = net.connect(server.address().port);
    client.on('connect', () => {
      writeHeaders(client, headers);
      client.resume();
    });
    client.pipe(process.stdout);
  }));
});
test1();
