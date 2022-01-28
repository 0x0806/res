'use strict';
const assert = require('assert');
const http = require('http');
const incomingMessage = new http.IncomingMessage();
assert.strictEqual(incomingMessage.connection, undefined);
assert.strictEqual(incomingMessage.socket, undefined);
incomingMessage.connection = 'fhqwhgads';
assert.strictEqual(incomingMessage.connection, 'fhqwhgads');
assert.strictEqual(incomingMessage.socket, 'fhqwhgads');
