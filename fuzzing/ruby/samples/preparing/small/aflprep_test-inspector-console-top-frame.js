'use strict';
common.skipIfInspectorDisabled();
const assert = require('assert');
const { Session } = require('inspector');
const { basename } = require('path');
function logMessage() {
  console.log('Log a message');
}
const session = new Session();
let topFrame;
session.once('Runtime.consoleAPICalled', (notification) => {
  topFrame = (notification.params.stackTrace.callFrames[0]);
});
session.connect();
session.post('Runtime.enable');
session.disconnect();
assert.strictEqual(basename(topFrame.url), basename(__filename));
assert.strictEqual(topFrame.lineNumber, 15);
