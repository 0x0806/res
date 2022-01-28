'use strict';
const http = require('http');
const assert = require('assert');
const server = http.createServer(function(req, res) {
  let body = '';
  req.setEncoding('utf8');
  req.on('data', function(chunk) {
    body += chunk;
  });
  req.on('end', function() {
    assert.strictEqual(body, 'PING');
    res.writeHead(200);
    res.end('PONG');
  });
});
server.on('listening', pingping);
function serverOn() {
  console.error('Server ON');
  server.listen(common.PORT);
}
function serverOff() {
  console.error('Server OFF');
  server.close();
  pingping();
}
const responses = [];
function afterPing(result) {
  responses.push(result);
  console.error(`afterPing. responses.length = ${responses.length}`);
  switch (responses.length) {
    case 2:
      assert.match(responses[0], ECONNREFUSED_RE);
      assert.match(responses[1], ECONNREFUSED_RE);
      serverOn();
      break;
    case 4:
      assert.match(responses[2], successRE);
      assert.match(responses[3], successRE);
      serverOff();
      break;
    case 6:
      assert.match(responses[4], ECONNREFUSED_RE);
      assert.match(responses[5], ECONNREFUSED_RE);
      serverOn();
      break;
    case 8:
      assert.match(responses[6], successRE);
      assert.match(responses[7], successRE);
      server.close();
      break;
  }
}
function ping() {
  console.error('making req');
  const opt = {
    port: common.PORT,
    method: 'POST'
  };
  const req = http.request(opt, function(res) {
    let body = '';
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
      body += chunk;
    });
    res.on('end', function() {
      assert.strictEqual(body, 'PONG');
      assert.ok(!hadError);
      gotEnd = true;
      afterPing('success');
    });
  });
  req.end('PING');
  let gotEnd = false;
  let hadError = false;
  req.on('error', function(error) {
    console.log(`Error making ping req: ${error}`);
    hadError = true;
    assert.ok(!gotEnd);
    afterPing(error.message);
  });
}
function pingping() {
  ping();
  ping();
}
pingping();
process.on('exit', function() {
  console.error("process.on('exit')");
  console.error(responses);
  assert.strictEqual(responses.length, 8);
});
