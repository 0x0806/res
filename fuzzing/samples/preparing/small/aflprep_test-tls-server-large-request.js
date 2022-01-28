'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const tls = require('tls');
const stream = require('stream');
const options = {
  key: fixtures.readKey('agent1-key.pem'),
  cert: fixtures.readKey('agent1-cert.pem')
};
class Mediator extends stream.Writable {
  constructor() {
    super();
    this.buf = '';
  }
  _write(data, enc, cb) {
    this.buf += data;
    setTimeout(cb, 0);
    if (this.buf.length >= request.length) {
      assert.strictEqual(this.buf, request.toString());
      server.close();
    }
  }
}
const mediator = new Mediator();
const server = tls.Server(options, common.mustCall(function(socket) {
  socket.pipe(mediator);
}));
server.listen(0, common.mustCall(() => {
  const client1 = tls.connect({
    port: server.address().port,
    rejectUnauthorized: false
  }, common.mustCall(function() {
    client1.end(request);
  }));
}));
