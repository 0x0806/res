'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const https = require('https');
const options = {
  key: fixtures.readKey('rsa_private.pem'),
  cert: fixtures.readKey('rsa_cert.crt')
};
const bufSize = 1024 * 1024;
let sent = 0;
let received = 0;
const server = https.createServer(options, function(req, res) {
  res.writeHead(200);
  req.pipe(res);
});
server.listen(0, function() {
  let resumed = false;
  const req = https.request({
    method: 'POST',
    port: this.address().port,
    rejectUnauthorized: false
  }, function(res) {
    let timer;
    res.pause();
    console.error('paused');
    send();
    function send() {
      if (req.write(Buffer.allocUnsafe(bufSize))) {
        sent += bufSize;
        return process.nextTick(send);
      }
      sent += bufSize;
      console.error(`sent: ${sent}`);
      resumed = true;
      res.resume();
      console.error('resumed');
      timer = setTimeout(function() {
        process.exit(1);
      }, 1000);
    }
    res.on('data', function(data) {
      assert.ok(resumed);
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      received += data.length;
      if (received >= sent) {
        console.error(`received: ${received}`);
        req.end();
        server.close();
      }
    });
  });
  req.write('a');
  ++sent;
});
process.on('exit', function() {
  assert.strictEqual(sent, received);
});
