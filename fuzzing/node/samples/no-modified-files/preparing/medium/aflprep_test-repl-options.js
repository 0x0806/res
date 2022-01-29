'use strict';
const assert = require('assert');
const repl = require('repl');
const cp = require('child_process');
assert.strictEqual(repl.repl, undefined);
common.expectWarning({
  DeprecationWarning: {
    DEP0142:
      'repl._builtinLibs is deprecated. Check module.builtinModules instead',
    DEP0141: 'repl.inputStream and repl.outputStream are deprecated. ' +
             'Use repl.input and repl.output instead',
  }
});
const stream = new ArrayStream();
const r1 = repl.start({
  input: stream,
  output: stream,
  terminal: true
});
assert.strictEqual(r1.input, stream);
assert.strictEqual(r1.output, stream);
assert.strictEqual(r1.input, r1.inputStream);
assert.strictEqual(r1.output, r1.outputStream);
assert.strictEqual(r1.terminal, true);
assert.strictEqual(r1.useColors, r1.terminal);
assert.strictEqual(r1.useGlobal, false);
assert.strictEqual(r1.ignoreUndefined, false);
assert.strictEqual(r1.replMode, repl.REPL_MODE_SLOPPY);
assert.strictEqual(r1.historySize, 30);
function writer() {}
function evaler() {}
const r2 = repl.start({
  input: stream,
  output: stream,
  terminal: false,
  useColors: true,
  useGlobal: true,
  ignoreUndefined: true,
  eval: evaler,
  writer: writer,
  replMode: repl.REPL_MODE_STRICT,
  historySize: 50
});
assert.strictEqual(r2.input, stream);
assert.strictEqual(r2.output, stream);
assert.strictEqual(r2.input, r2.inputStream);
assert.strictEqual(r2.output, r2.outputStream);
assert.strictEqual(r2.terminal, false);
assert.strictEqual(r2.useColors, true);
assert.strictEqual(r2.useGlobal, true);
assert.strictEqual(r2.ignoreUndefined, true);
assert.strictEqual(r2.writer, writer);
assert.strictEqual(r2.replMode, repl.REPL_MODE_STRICT);
assert.strictEqual(r2.historySize, 50);
const r3 = () => repl.start({
  breakEvalOnSigint: true,
  eval: true
});
assert.throws(r3, {
  code: 'ERR_INVALID_REPL_EVAL_CONFIG',
  name: 'TypeError',
  message: 'Cannot specify both "breakEvalOnSigint" and "eval" for REPL'
});
const r4 = repl.start();
assert.strictEqual(r4.getPrompt(), '> ');
assert.strictEqual(r4.input, process.stdin);
assert.strictEqual(r4.output, process.stdout);
assert.strictEqual(r4.terminal, !!r4.output.isTTY);
assert.strictEqual(r4.useColors, r4.terminal);
assert.strictEqual(r4.useGlobal, false);
assert.strictEqual(r4.ignoreUndefined, false);
assert.strictEqual(r4.replMode, repl.REPL_MODE_SLOPPY);
assert.strictEqual(r4.historySize, 30);
r4.close();
{
  const child = cp.spawn(process.execPath, ['--interactive']);
  let output = '';
  child.stdout.setEncoding('utf8');
  child.stdout.on('data', (data) => {
    output += data;
  });
  child.on('exit', common.mustCall(() => {
    assert.deepStrictEqual(results, ['undefined', '']);
  }));
  child.stdin.write(
    'assert.ok(util.inspect(repl.repl, {depth: -1}).includes("REPLServer"));\n'
  );
  child.stdin.write('.exit');
  child.stdin.end();
}
