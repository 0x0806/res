'use strict';
const assert = require('assert');
const http = require('http');
const test_req_body = 'some stuff...\n';
const test_res_body = 'other stuff!\n';
let sent_continue = false;
let got_continue = false;
const handler = common.mustCall((req, res) => {
  assert.ok(sent_continue, 'Full response sent before 100 Continue');
  console.error('Server sending full response...');
  res.writeHead(200, {
    'ABCD': '1'
  });
  res.end(test_res_body);
});
const server = http.createServer(common.mustNotCall());
server.on('checkContinue', common.mustCall((req, res) => {
  console.error('Server got Expect: 100-continue...');
  res.writeContinue();
  sent_continue = true;
  setTimeout(function() {
    handler(req, res);
  }, 100);
}));
server.listen(0);
server.on('listening', common.mustCall(() => {
  const req = http.request({
    port: server.address().port,
    method: 'POST',
    headers: { 'Expect': '100-continue' }
  });
  console.error('Client sending request...');
  let body = '';
  req.on('continue', common.mustCall(() => {
    console.error('Client got 100 Continue...');
    got_continue = true;
    req.end(test_req_body);
  }));
  req.on('response', common.mustCall((res) => {
    assert.ok(got_continue, 'Full response received before 100 Continue');
    assert.strictEqual(res.statusCode, 200,
                       `Final status code was ${res.statusCode}, not 200.`);
    res.setEncoding('utf8');
    res.on('data', function(chunk) { body += chunk; });
    res.on('end', common.mustCall(() => {
      console.error('Got full response.');
      assert.strictEqual(body, test_res_body);
      assert.ok('abcd' in res.headers, 'Response headers missing.');
      server.close();
    }));
  }));
}));
