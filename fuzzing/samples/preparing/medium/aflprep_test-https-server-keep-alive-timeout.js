'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const https = require('https');
const tls = require('tls');
const tests = [];
const serverOptions = {
  key: fixtures.readKey('agent1-key.pem'),
  cert: fixtures.readKey('agent1-cert.pem')
};
function test(fn) {
  if (!tests.length) {
    process.nextTick(run);
  }
  tests.push(fn);
}
function run() {
  const fn = tests.shift();
  if (fn) fn(run);
}
test(function serverKeepAliveTimeoutWithPipeline(cb) {
  const server = https.createServer(
    serverOptions,
    common.mustCall((req, res) => {
      res.end();
    }, 3));
  server.setTimeout(common.platformTimeout(500), common.mustCall((socket) => {
    socket.destroy();
    server.close();
    cb();
  }));
  server.keepAliveTimeout = common.platformTimeout(50);
  server.listen(0, common.mustCall(() => {
    const options = {
      port: server.address().port,
      allowHalfOpen: true,
      rejectUnauthorized: false
    };
    const c = tls.connect(options, () => {
    });
  }));
});
test(function serverNoEndKeepAliveTimeoutWithPipeline(cb) {
  const server = https.createServer(serverOptions, common.mustCall(3));
  server.setTimeout(common.platformTimeout(500), common.mustCall((socket) => {
    socket.destroy();
    server.close();
    cb();
  }));
  server.keepAliveTimeout = common.platformTimeout(50);
  server.listen(0, common.mustCall(() => {
    const options = {
      port: server.address().port,
      allowHalfOpen: true,
      rejectUnauthorized: false
    };
    const c = tls.connect(options, () => {
    });
  }));
});
