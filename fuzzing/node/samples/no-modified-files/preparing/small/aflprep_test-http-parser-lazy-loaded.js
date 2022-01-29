'use strict';
class DummyParser {
  constructor() {
    this.test_type = null;
  }
  initialize(type) {
    this.test_type = type;
  }
}
DummyParser.REQUEST = Symbol();
const binding = internalBinding('http_parser');
binding.HTTPParser = DummyParser;
const assert = require('assert');
const { spawn } = require('child_process');
const { parsers } = require('_http_common');
const parser = parsers.alloc();
parser.initialize(DummyParser.REQUEST, {});
assert.strictEqual(parser instanceof DummyParser, true);
assert.strictEqual(parser.test_type, DummyParser.REQUEST);
if (process.argv[2] !== 'child') {
  const child = spawn(process.execPath, [
    '--expose-internals', __filename, 'child',
  ], {
    stdio: ['inherit', 'inherit', 'inherit', 'ipc']
  });
  child.on('exit', common.mustCall((code, signal) => {
    assert.strictEqual(code, 0);
    assert.strictEqual(signal, null);
  }));
}
