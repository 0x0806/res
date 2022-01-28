'use strict';
const { Writable } = require('stream');
const { Console } = require('console');
const stream = new Writable({
  write() {
  }
});
const console = new Console({ stdout: stream });
