'use strict';
const { strictEqual } = require('assert');
const buffer = require('buffer');
strictEqual(globalThis.atob, buffer.atob);
strictEqual(globalThis.btoa, buffer.btoa);
