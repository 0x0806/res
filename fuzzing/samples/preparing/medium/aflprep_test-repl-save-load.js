'use strict';
const assert = require('assert');
const join = require('path').join;
const fs = require('fs');
tmpdir.refresh();
const repl = require('repl');
const works = [['inner.one'], 'inner.o'];
const putIn = new ArrayStream();
const testMe = repl.start('', putIn);
testMe._domain.on('error', function(reason) {
  const err = new Error('Test failed');
  err.reason = reason;
  throw err;
});
const testFile = [
  'let inner = (function() {',
  '  return {one:1};',
  '})()',
];
const saveFileName = join(tmpdir.path, 'test.save.js');
putIn.run(testFile);
putIn.run([`.save ${saveFileName}`]);
assert.strictEqual(fs.readFileSync(saveFileName, 'utf8'),
                   testFile.join('\n'));
testMe.complete('inner.o', common.mustSucceed((data) => {
  assert.deepStrictEqual(data, works);
}));
putIn.run(['.clear']);
putIn.run([`.load ${saveFileName}`]);
testMe.complete('inner.o', common.mustSucceed((data) => {
  assert.deepStrictEqual(data, works);
}));
putIn.run(['.clear']);
let loadFile = join(tmpdir.path, 'file.does.not.exist');
putIn.write = common.mustCall(function(data) {
  assert.strictEqual(data, `Failed to load: ${loadFile}\n`);
  putIn.write = () => {};
});
putIn.run([`.load ${loadFile}`]);
loadFile = tmpdir.path;
putIn.write = common.mustCall(function(data) {
  assert.strictEqual(data, `Failed to load: ${loadFile} is not a valid file\n`);
  putIn.write = () => {};
});
putIn.run([`.load ${loadFile}`]);
putIn.run(['.clear']);
const invalidFileName = join(tmpdir.path, '\0\0\0\0\0');
putIn.write = common.mustCall(function(data) {
  assert.strictEqual(data, `Failed to save: ${invalidFileName}\n`);
  putIn.write = () => {};
});
putIn.run([`.save ${invalidFileName}`]);
{
  const cmds = [
    'function testSave() {',
    'return "saved";',
    '}',
  ];
  const putIn = new ArrayStream();
  const replServer = repl.start({ terminal: true, stream: putIn });
  putIn.run(['.editor']);
  putIn.run(cmds);
  replServer.write('', { ctrl: true, name: 'd' });
  putIn.run([`.save ${saveFileName}`]);
  replServer.close();
  assert.strictEqual(fs.readFileSync(saveFileName, 'utf8'),
                     `${cmds.join('\n')}\n`);
}
