'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const tls = require('tls');
process.stdout.write('build body...');
const body = 'hello world\n'.repeat(1024 * 1024);
process.stdout.write('done\n');
const options = {
  key: fixtures.readKey('agent2-key.pem'),
  cert: fixtures.readKey('agent2-cert.pem')
};
const server = tls.Server(options, common.mustCall(function(socket) {
  socket.end(body);
}));
let recvCount = 0;
server.listen(0, function() {
  const client = tls.connect({
    port: server.address().port,
    rejectUnauthorized: false
  });
  client.on('data', function(d) {
    process.stdout.write('.');
    recvCount += d.length;
    client.pause();
    process.nextTick(function() {
      client.resume();
    });
  });
  client.on('close', function() {
    console.error('close');
    server.close();
    clearTimeout(timeout);
  });
});
function displayCounts() {
  console.log(`body.length: ${body.length}`);
  console.log(`  recvCount: ${recvCount}`);
}
const timeout = setTimeout(displayCounts, 10 * 1000);
process.on('exit', function() {
  displayCounts();
  assert.strictEqual(body.length, recvCount);
});
