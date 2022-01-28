'use strict';
const assert = require('assert');
const http = require('http');
const net = require('net');
function check(hdr, snd, rcv) {
  const server = http.createServer(common.mustCall((req, res) => {
    assert.strictEqual(req.headers[hdr], rcv);
    req.pipe(res);
  }));
  server.listen(0, common.mustCall(function() {
    const client = net.connect(this.address().port, start);
    function start() {
    }
    function drain() {
      if (snd.length === 0) {
        return client.write('\r\nConnection: close\r\n\r\n');
      }
      client.write(snd.shift(), drain);
    }
    const bufs = [];
    client.on('data', function(chunk) {
      bufs.push(chunk);
    });
    client.on('end', common.mustCall(function() {
      const head = Buffer.concat(bufs)
        .toString('latin1')
        .split('\r\n')[0];
      server.close();
    }));
  }));
}
check('host', [' \t foo.com\t'], 'foo.com');
check('host', [' \t foo\tcom\t'], 'foo\tcom');
check('host', [' \t', ' ', ' foo.com\t', '\t '], 'foo.com');
check('host', [' \t', ' \t'.repeat(100), '\t '], '');
check('host', [' \t', ' - - - -   ', '\t '], '- - - -');
