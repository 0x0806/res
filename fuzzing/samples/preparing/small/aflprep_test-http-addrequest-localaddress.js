'use strict';
const assert = require('assert');
const agent = require('http').globalAgent;
const req = {
  getHeader: () => {}
};
agent.maxSockets = 0;
agent.addRequest(req, 'localhost', 8080, '127.0.0.1');
assert.strictEqual(Object.keys(agent.requests).length, 1);
assert.strictEqual(
  Object.keys(agent.requests)[0],
  'localhost:8080:127.0.0.1');
agent.addRequest(req, {
  host: 'localhost',
  port: 8080,
  localAddress: '127.0.0.1',
});
assert.strictEqual(Object.keys(agent.requests).length, 1);
assert.strictEqual(
  Object.keys(agent.requests)[0],
  'localhost:8080:127.0.0.1');
