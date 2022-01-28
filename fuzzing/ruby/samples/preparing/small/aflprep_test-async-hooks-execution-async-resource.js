'use strict';
const assert = require('assert');
const { executionAsyncResource, createHook } = require('async_hooks');
const { createServer, get } = require('http');
const sym = Symbol('cls');
assert.ok(executionAsyncResource());
createHook({
  init(asyncId, type, triggerAsyncId, resource) {
    const cr = executionAsyncResource();
    resource[sym] = cr[sym];
  }
}).enable();
const server = createServer(function(req, res) {
  executionAsyncResource()[sym] = { state: req.url };
  setTimeout(function() {
    const { state } = executionAsyncResource()[sym];
    res.end(JSON.stringify({ state }));
  }, 10);
});
function test(n) {
    res.setEncoding('utf8');
    let body = '';
    res.on('data', function(chunk) {
      body += chunk;
    });
    res.on('end', common.mustCall(function() {
    }));
  }));
}
server.listen(0, common.mustCall(function() {
  server.unref();
  for (let i = 0; i < 10; i++) {
    test(i);
  }
}));
