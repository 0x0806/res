'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const tls = require('tls');
let cconn = null;
let sconn = null;
let read_len = 0;
const buffer_size = 1024 * 1024;
function test() {
  if (cconn && sconn) {
    cconn.resume();
    sconn.resume();
    sconn.end(Buffer.alloc(buffer_size));
  }
}
const server = tls.createServer({
  key: fixtures.readKey('agent1-key.pem'),
  cert: fixtures.readKey('agent1-cert.pem')
}, (c) => {
  c.on('close', common.mustCall(() => server.close()));
  sconn = c;
  test();
}).listen(0, common.mustCall(function() {
  tls.connect(this.address().port, {
    rejectUnauthorized: false
  }, common.mustCall(function() {
    cconn = this;
    cconn.on('data', (d) => {
      read_len += d.length;
      if (read_len === buffer_size) {
        cconn.end();
      }
    });
    test();
  }));
}));
