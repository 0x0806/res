'use strict';
const assert = require('assert');
const http = require('http');
const server = http.createServer(function(request, response) {
  console.log(`responding to ${request.url}`);
  response.write('1\n');
  response.write('');
  response.write('2\n');
  response.write('');
  response.end('3\n');
  this.close();
});
server.listen(0, common.mustCall(() => {
  http.get({ port: server.address().port }, common.mustCall((res) => {
    let response = '';
    assert.strictEqual(res.statusCode, 200);
    res.setEncoding('ascii');
    res.on('data', (chunk) => {
      response += chunk;
    });
    res.on('end', common.mustCall(() => {
      assert.strictEqual(response, '1\n2\n3\n');
    }));
  }));
}));
