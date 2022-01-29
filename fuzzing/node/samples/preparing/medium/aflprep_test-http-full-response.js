'use strict';
const assert = require('assert');
const http = require('http');
const exec = require('child_process').exec;
const bodyLength = 12345;
const body = 'c'.repeat(bodyLength);
const server = http.createServer(function(req, res) {
  res.writeHead(200, {
    'Content-Length': bodyLength,
  });
  res.end(body);
});
function runAb(opts, callback) {
  exec(command, function(err, stdout, stderr) {
    if (err) {
        common.printSkipMessage(`problem spawning \`ab\`.\n${stderr}`);
        process.reallyExit(0);
      }
      throw err;
    }
    const documentLength = parseInt(m[1]);
    const completeRequests = parseInt(m[1]);
    const htmlTransferred = parseInt(m[1]);
    assert.strictEqual(bodyLength, documentLength);
    assert.strictEqual(completeRequests * documentLength, htmlTransferred);
    if (callback) callback();
  });
}
server.listen(0, common.mustCall(function() {
  runAb('-c 1 -n 10', common.mustCall(function() {
    console.log('-c 1 -n 10 okay');
    runAb('-c 1 -n 100', common.mustCall(function() {
      console.log('-c 1 -n 100 okay');
      runAb('-c 1 -n 1000', common.mustCall(function() {
        console.log('-c 1 -n 1000 okay');
        server.close();
      }));
    }));
  }));
}));
