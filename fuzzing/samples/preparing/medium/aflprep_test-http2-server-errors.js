'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const h2 = require('http2');
{
  let expected = null;
  const server = h2.createServer();
  server.on('stream', common.mustCall(function(stream) {
    stream.on('error', common.mustCall(function(err) {
      assert.strictEqual(err, expected);
    }));
    stream.resume();
    stream.write('hello');
    expected = new Error('kaboom');
    stream.destroy(expected);
    server.close();
  }));
  server.listen(0, common.mustCall(function() {
    const port = server.address().port;
    const client = h2.connect(url, common.mustCall(function() {
      const headers = {
        ':method': 'GET',
        ':scheme': 'http',
        ':authority': `localhost:${port}`,
      };
      const request = client.request(headers);
      request.on('data', common.mustCall(function(chunk) {
        client.destroy();
      }));
      request.end();
    }));
  }));
}
{
  let expected = null;
  const server = h2.createServer();
  process.on('uncaughtException', common.mustCall(function(err) {
    assert.strictEqual(err.message, 'kaboom no handler');
  }));
  server.on('stream', common.mustCall(function(stream) {
    stream.write('hello');
    stream.resume();
    expected = new Error('kaboom no handler');
    stream.destroy(expected);
    server.close();
  }));
  server.listen(0, common.mustCall(function() {
    const port = server.address().port;
    const client = h2.connect(url, common.mustCall(function() {
      const headers = {
        ':method': 'GET',
        ':scheme': 'http',
        ':authority': `localhost:${port}`,
      };
      const request = client.request(headers);
      request.on('data', common.mustCall(function(chunk) {
        client.destroy();
      }));
      request.end();
    }));
  }));
}
