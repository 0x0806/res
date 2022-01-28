'use strict';
const assert = require('assert');
const EventEmitter = require('events');
const e = new EventEmitter();
e.on('hello', assert);
if (process.argv[2] !== 'child') {
  tmpdir.refresh();
  const { spawnSync } = require('child_process');
  let threw = false;
  try {
    e.emit('hello', false);
  } catch (err) {
    const frames = err.stack.split('\n');
    const { output, status, error } =
      spawnSync(process.execPath,
                [process.argv[1], 'child', filename, line, column],
                { cwd: tmpdir.path, env: process.env });
    assert.ifError(error);
    assert.strictEqual(status, 0, `Exit code: ${status}\n${output}`);
    threw = true;
  }
  assert.ok(threw);
} else {
  const { writeFileSync } = require('fs');
  const [, , , filename, line, column] = process.argv;
  const data = `${'\n'.repeat(line - 1)}${' '.repeat(column - 1)}` +
               'ok(failed(badly));';
  writeFileSync(filename, data);
  assert.throws(
    () => e.emit('hello', false),
    {
      message: 'false == true'
    }
  );
}
