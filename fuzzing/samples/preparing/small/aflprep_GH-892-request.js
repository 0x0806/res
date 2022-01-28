const https = require('https');
const fs = require('fs');
const assert = require('assert');
var PORT = parseInt(process.argv[2]);
var bytesExpected = parseInt(process.argv[3]);
var gotResponse = false;
var options = {
  method: 'POST',
  port: PORT,
  rejectUnauthorized: false
};
var req = https.request(options, function(res) {
  assert.strictEqual(res.statusCode, 200);
  gotResponse = true;
  console.error('DONE');
  res.resume();
});
req.end(Buffer.allocUnsafe(bytesExpected));
process.on('exit', function() {
  assert.ok(gotResponse);
});
