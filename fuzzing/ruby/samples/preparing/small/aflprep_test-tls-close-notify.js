'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const tls = require('tls');
const { ShutdownWrap } = internalBinding('stream_wrap');
const server = tls.createServer({
  key: fixtures.readKey('agent1-key.pem'),
  cert: fixtures.readKey('agent1-cert.pem')
}, function(c) {
  c.on('end', common.mustCall(function() {
    server.close();
  }));
}).listen(0, common.mustCall(function() {
  const c = tls.connect(this.address().port, {
    rejectUnauthorized: false
  }, common.mustCall(function() {
    const req = new ShutdownWrap();
    req.oncomplete = common.mustCall(() => {});
    req.handle = c._handle;
    c._handle.shutdown(req);
  }));
}));
