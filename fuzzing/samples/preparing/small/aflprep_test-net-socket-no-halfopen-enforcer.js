'use strict';
const { Socket } = require('net');
const { strictEqual } = require('assert');
const socket = new Socket({ allowHalfOpen: false });
strictEqual(socket.listenerCount('end'), 1);
