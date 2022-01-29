'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const spawn = require('child_process').spawn;
const https = require('https');
const bytesExpected = 1024 * 1024 * 32;
let started = false;
const childScript = fixtures.path('GH-892-request.js');
function makeRequest() {
  if (started) return;
  started = true;
  let stderrBuffer = '';
  const args = process.execArgv.concat([ childScript,
                                         server.address().port,
                                         bytesExpected ]);
  const child = spawn(process.execPath, args);
  child.on('exit', function(code) {
    assert.strictEqual(code, 0);
  });
  child.stderr.pipe(process.stderr);
  child.stdout.pipe(process.stdout);
  child.stderr.setEncoding('ascii');
  child.stderr.on('data', function(d) {
    stderrBuffer += d;
  });
}
const serverOptions = {
  key: fixtures.readKey('agent1-key.pem'),
  cert: fixtures.readKey('agent1-cert.pem')
};
let uploadCount = 0;
const server = https.Server(serverOptions, function(req, res) {
  server.close();
  req.on('data', function(d) {
    process.stderr.write('.');
    uploadCount += d.length;
  });
  req.on('end', function() {
    assert.strictEqual(uploadCount, bytesExpected);
    res.end('successful upload\n');
  });
});
server.listen(0, function() {
  console.log(`expecting ${bytesExpected} bytes`);
  makeRequest();
});
process.on('exit', function() {
  console.error(`got ${uploadCount} bytes`);
  assert.strictEqual(uploadCount, bytesExpected);
});
