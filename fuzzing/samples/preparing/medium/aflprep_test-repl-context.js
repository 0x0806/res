'use strict';
const assert = require('assert');
const repl = require('repl');
const vm = require('vm');
const stream = new ArrayStream();
{
  const r = repl.start({
    input: stream,
    output: stream,
    useGlobal: false
  });
  let output = '';
  stream.write = function(d) {
    output += d;
  };
  assert(r.context.console);
  assert.notStrictEqual(r.context.console, console);
  assert.notStrictEqual(r.context.Object, Object);
  stream.run(['({} instanceof Object)']);
  assert.strictEqual(output, 'true\n> ');
  const context = r.createContext();
  assert(context.console instanceof require('console').Console);
  assert.strictEqual(context.global, context);
  context.console = 'foo';
  r.close();
}
{
  const server = repl.start({ input: stream, output: stream });
  assert.ok(!server.underscoreAssigned);
  assert.strictEqual(server.lines.length, 0);
  server.write('_ = 500;\n');
  assert.ok(server.underscoreAssigned);
  assert.strictEqual(server.lines.length, 1);
  assert.strictEqual(server.lines[0], '_ = 500;');
  assert.strictEqual(server.last, 500);
  const context = server.createContext();
  assert.ok(server.underscoreAssigned);
  assert.strictEqual(server.lines.length, 1);
  assert.strictEqual(server.lines[0], '_ = 500;');
  assert.strictEqual(server.last, 500);
  server.resetContext();
  assert.ok(!server.underscoreAssigned);
  assert.strictEqual(server.lines.length, 0);
  assert.ok(!server.underscoreAssigned);
  vm.runInContext('_ = 1000;\n', context);
  assert.ok(!server.underscoreAssigned);
  assert.strictEqual(server.lines.length, 0);
  server.close();
}
