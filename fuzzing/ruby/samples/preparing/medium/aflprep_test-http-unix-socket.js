'use strict';
const assert = require('assert');
const http = require('http');
const server = http.createServer(function(req, res) {
  res.writeHead(200, {
    'Connection': 'close'
  });
  res.write('hello ');
  res.write('world\n');
  res.end();
});
tmpdir.refresh();
server.listen(common.PIPE, common.mustCall(function() {
  const options = {
    socketPath: common.PIPE,
  };
  const req = http.get(options, common.mustCall(function(res) {
    assert.strictEqual(res.statusCode, 200);
    res.body = '';
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
      res.body += chunk;
    });
    res.on('end', common.mustCall(function() {
      assert.strictEqual(res.body, 'hello world\n');
      server.close(common.mustCall(function(error) {
        assert.strictEqual(error, undefined);
        server.close(common.expectsError({
          code: 'ERR_SERVER_NOT_RUNNING',
          message: 'Server is not running.',
          name: 'Error'
        }));
      }));
    }));
  }));
  req.on('error', function(e) {
    assert.fail(e);
  });
  req.end();
}));
