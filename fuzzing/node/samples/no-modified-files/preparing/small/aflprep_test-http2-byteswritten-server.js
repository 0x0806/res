'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const http2 = require('http2');
const http2Server = http2.createServer(common.mustCall(function(req, res) {
  res.socket.on('finish', common.mustCall(() => {
  }));
  res.write(Buffer.from('1'.repeat(1024)));
  res.end();
}));
http2Server.listen(0, common.mustCall(function() {
  const http2client = http2.connect(URL, { protocol: 'http:' });
  req.on('data', common.mustCall());
  req.on('end', common.mustCall(function() {
    http2client.close();
    http2Server.close();
  }));
  req.end();
}));
