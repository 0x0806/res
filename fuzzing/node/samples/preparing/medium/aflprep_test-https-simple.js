'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const https = require('https');
process.on('warning', common.mustNotCall());
const options = {
  key: fixtures.readKey('agent1-key.pem'),
  cert: fixtures.readKey('agent1-cert.pem')
};
const body = 'hello world\n';
const serverCallback = common.mustCall(function(req, res) {
  res.end(body);
});
const server = https.createServer(options, serverCallback);
server.listen(0, common.mustCall(() => {
  let tests = 0;
  function done() {
    if (--tests === 0)
      server.close();
  }
  const port = server.address().port;
  const options = {
    hostname: '127.0.0.1',
    port: port,
    method: 'GET',
    rejectUnauthorized: false
  };
  tests++;
  const req = https.request(options, common.mustCall((res) => {
    let responseBody = '';
    res.on('data', function(d) {
      responseBody = responseBody + d;
    });
    res.on('end', common.mustCall(() => {
      assert.strictEqual(responseBody, body);
      done();
    }));
  }));
  req.end();
  options.rejectUnauthorized = true;
  tests++;
  const checkCertReq = https.request(options, common.mustNotCall()).end();
  checkCertReq.on('error', common.mustCall((e) => {
    assert.strictEqual(e.code, 'UNABLE_TO_VERIFY_LEAF_SIGNATURE');
    done();
  }));
}));
