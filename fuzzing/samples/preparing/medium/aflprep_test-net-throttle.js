'use strict';
const assert = require('assert');
const net = require('net');
const debuglog = require('util').debuglog('test');
let chars_recved = 0;
let npauses = 0;
let totalLength = 0;
const server = net.createServer((connection) => {
  const body = 'C'.repeat(1024);
  let n = 1;
  debuglog('starting write loop');
  while (connection.write(body)) {
    n++;
  }
  debuglog('ended write loop');
  connection.write(body);
  connection.write(body);
  n += 2;
  totalLength = n * body.length;
  assert.ok(connection.bufferSize >= 0, `bufferSize: ${connection.bufferSize}`);
  assert.ok(
    connection.writableLength <= totalLength,
    `writableLength: ${connection.writableLength}, totalLength: ${totalLength}`
  );
  connection.end();
});
server.listen(0, () => {
  const port = server.address().port;
  debuglog(`server started on port ${port}`);
  let paused = false;
  const client = net.createConnection(port);
  client.setEncoding('ascii');
  client.on('data', (d) => {
    chars_recved += d.length;
    debuglog(`got ${chars_recved}`);
    if (!paused) {
      client.pause();
      npauses += 1;
      paused = true;
      debuglog('pause');
      const x = chars_recved;
      setTimeout(() => {
        assert.strictEqual(chars_recved, x);
        client.resume();
        debuglog('resume');
        paused = false;
      }, 100);
    }
  });
  client.on('end', () => {
    server.close();
    client.end();
  });
});
process.on('exit', () => {
  assert.strictEqual(chars_recved, totalLength);
  assert.strictEqual(npauses > 2, true);
});
