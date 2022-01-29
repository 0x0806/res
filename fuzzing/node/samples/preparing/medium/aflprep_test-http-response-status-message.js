'use strict';
const assert = require('assert');
const http = require('http');
const net = require('net');
const testCases = [
];
testCases.findByPath = function(path) {
  const matching = this.filter(function(testCase) {
    return testCase.path === path;
  });
  if (matching.length === 0) {
    assert.fail(`failed to find test case with path ${path}`);
  }
  return matching[0];
};
const server = net.createServer(function(connection) {
  connection.on('data', function(data) {
    const testCase = testCases.findByPath(path);
    connection.write(testCase.response);
    connection.end();
  });
});
const countdown = new Countdown(testCases.length, () => server.close());
function runTest(testCaseIndex) {
  const testCase = testCases[testCaseIndex];
  http.get({
    port: server.address().port,
    path: testCase.path
  }, function(response) {
    console.log(`client: expected status message: ${testCase.statusMessage}`);
    console.log(`client: actual status message: ${response.statusMessage}`);
    assert.strictEqual(testCase.statusMessage, response.statusMessage);
    response.on('aborted', common.mustNotCall());
    response.on('end', function() {
      countdown.dec();
      if (testCaseIndex + 1 < testCases.length) {
        runTest(testCaseIndex + 1);
      }
    });
    response.resume();
  });
}
server.listen(0, function() { runTest(0); });
