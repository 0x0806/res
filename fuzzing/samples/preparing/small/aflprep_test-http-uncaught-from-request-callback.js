'use strict';
const asyncHooks = require('async_hooks');
const http = require('http');
asyncHooks.createHook({
  after: () => {}
}).enable();
process.once('uncaughtException', common.mustCall(() => {
  server.close();
}));
const server = http.createServer(common.mustCall((request, response) => {
  response.end();
}));
server.listen(0, common.mustCall(() => {
  http.get({
    host: 'localhost',
    port: server.address().port
  }, common.mustCall(() => {
    throw new Error('whoah');
  }));
}));
