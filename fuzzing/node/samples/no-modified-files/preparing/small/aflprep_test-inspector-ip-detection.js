'use strict';
common.skipIfInspectorDisabled();
const assert = require('assert');
const os = require('os');
const ip = pickIPv4Address();
if (!ip)
  common.skip('No IP address found');
function checkIpAddress(ip, response) {
  const res = response[0];
  const wsUrl = res.webSocketDebuggerUrl;
  assert.ok(wsUrl);
  assert.strictEqual(ip, match[1]);
  assert.strictEqual(res.id, match[2]);
}
function pickIPv4Address() {
  for (const i of [].concat(...Object.values(os.networkInterfaces()))) {
    if (i.family === 'IPv4' && i.address !== '127.0.0.1')
      return i.address;
  }
}
async function test() {
  const instance = new NodeInstance('--inspect-brk=0.0.0.0:0');
  try {
  } catch (error) {
    if (error.code === 'EHOSTUNREACH') {
      common.printSkipMessage('Unable to connect to self');
    } else {
      throw error;
    }
  }
  instance.kill();
}
test().then(common.mustCall());
