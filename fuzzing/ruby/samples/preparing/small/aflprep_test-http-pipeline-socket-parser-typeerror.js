'use strict';
const http = require('http');
const net = require('net');
let once = false;
let first = null;
let second = null;
const chunk = Buffer.alloc(1024, 'X');
let size = 0;
let more;
let done;
const server = http
  .createServer((req, res) => {
    if (!once) server.close();
    once = true;
    if (first === null) {
      first = res;
      return;
    }
    if (second === null) {
      second = res;
      res.write(chunk);
    } else {
      res.end(chunk);
    }
    size += res.outputSize;
    if (size <= req.socket.writableHighWaterMark) {
      more();
      return;
    }
    done();
  })
  .on('upgrade', (req, socket) => {
    second.end(chunk, () => {
      socket.end();
    });
    first.end('hello');
  })
  .listen(0, () => {
    const s = net.connect(server.address().port);
    more = () => {
    };
    done = () => {
      s.write(
      );
    };
    more();
    more();
    s.resume();
  });
