'use strict';
const assert = require('assert');
const net = require('net');
const N = 200;
let recv = '';
let chars_recved = 0;
const server = net.createServer((connection) => {
  function write(j) {
    if (j >= N) {
      connection.end();
      return;
    }
    setTimeout(() => {
      connection.write('C');
      write(j + 1);
    }, 10);
  }
  write(0);
});
server.on('listening', () => {
  const client = net.createConnection(server.address().port);
  client.setEncoding('ascii');
  client.on('data', (d) => {
    console.log(d);
    recv += d;
  });
  setTimeout(() => {
    chars_recved = recv.length;
    console.log(`pause at: ${chars_recved}`);
    assert.strictEqual(chars_recved > 1, true);
    client.pause();
    setTimeout(() => {
      console.log(`resume at: ${chars_recved}`);
      assert.strictEqual(chars_recved, recv.length);
      client.resume();
      setTimeout(() => {
        chars_recved = recv.length;
        console.log(`pause at: ${chars_recved}`);
        client.pause();
        setTimeout(() => {
          console.log(`resume at: ${chars_recved}`);
          assert.strictEqual(chars_recved, recv.length);
          client.resume();
        }, 500);
      }, 500);
    }, 500);
  }, 500);
  client.on('end', () => {
    server.close();
    client.end();
  });
});
server.listen(0);
process.on('exit', () => {
  assert.strictEqual(recv.length, N);
  console.error('Exit');
});
