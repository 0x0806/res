'use strict';
const assert = require('assert');
const http = require('http');
const incomingMessage = new http.IncomingMessage();
assert.strictEqual(incomingMessage.destroy(), incomingMessage);
