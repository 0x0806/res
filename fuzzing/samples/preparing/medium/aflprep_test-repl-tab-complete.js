'use strict';
const {
  hijackStderr,
  restoreStderr
const assert = require('assert');
const path = require('path');
const { builtinModules } = require('module');
const publicModules = builtinModules.filter(
);
const hasInspector = process.features.inspector;
if (!common.isMainThread)
  common.skip('process.chdir is not available in Workers');
process.chdir(fixtures.fixturesDir);
const repl = require('repl');
function getNoResultsFunction() {
  return common.mustSucceed((data) => {
    assert.deepStrictEqual(data[0], []);
  });
}
const works = [['inner.one'], 'inner.o'];
const putIn = new ArrayStream();
const testMe = repl.start({
  prompt: '',
  input: putIn,
  output: process.stdout,
  allowBlockingCompletions: true
});
testMe._domain.on('error', assert.ifError);
putIn.run([
  'var inner = {',
  'one:1',
]);
testMe.complete('inner.o', getNoResultsFunction());
testMe.complete('console.lo', common.mustCall(function(error, data) {
  assert.deepStrictEqual(data, [['console.log'], 'console.lo']);
}));
testMe.complete('console?.lo', common.mustCall((error, data) => {
  assert.deepStrictEqual(data, [['console?.log'], 'console?.lo']);
}));
testMe.complete('console?.zzz', common.mustCall((error, data) => {
  assert.deepStrictEqual(data, [[], 'console?.zzz']);
}));
testMe.complete('console?.', common.mustCall((error, data) => {
  assert(data[0].includes('console?.log'));
  assert.strictEqual(data[1], 'console?.');
}));
putIn.run(['};']);
testMe.complete('inner.o', common.mustCall(function(error, data) {
  assert.deepStrictEqual(data, works);
}));
putIn.run(['.clear']);
putIn.run([
  'var inner = ( true ',
  '?',
  '{one: 1} : ',
]);
testMe.complete('inner.o', getNoResultsFunction());
putIn.run(['.clear']);
putIn.run([
  'var top = function() {',
  'var inner = {one:1};',
]);
testMe.complete('inner.o', getNoResultsFunction());
putIn.run(['};']);
testMe.complete('inner.o', getNoResultsFunction());
putIn.run(['.clear']);
putIn.run([
  'var top = function() {',
  'var inner = {',
  ' one:1',
  '};',
]);
testMe.complete('inner.o', getNoResultsFunction());
putIn.run(['.clear']);
putIn.run([
  'var top = function(one, two) {',
  'var inner = {',
  ' one:1',
  '};',
]);
testMe.complete('inner.o', getNoResultsFunction());
putIn.run(['.clear']);
putIn.run([
  'var top = function() {',
  '(function test () {',
  'var inner = {',
  ' one:1',
  '};',
]);
testMe.complete('inner.o', getNoResultsFunction());
putIn.run(['.clear']);
putIn.run([
  'var top = function() {',
  'r = function test (',
  ' one, two) {',
  'var inner = {',
  ' one:1',
  '};',
]);
testMe.complete('inner.o', getNoResultsFunction());
putIn.run(['.clear']);
putIn.run([
  'var top = function() {',
  'r = function test ()',
  '{',
  'var inner = {',
  ' one:1',
  '};',
]);
testMe.complete('inner.o', getNoResultsFunction());
putIn.run(['.clear']);
putIn.run([
  'var top = function() {',
  'r = function test (',
  ')',
  '{',
  'var inner = {',
  ' one:1',
  '};',
]);
testMe.complete('inner.o', getNoResultsFunction());
putIn.run(['.clear']);
putIn.run([
  'var str = "test";',
]);
testMe.complete('str.len', common.mustCall(function(error, data) {
  assert.deepStrictEqual(data, [['str.length'], 'str.len']);
}));
putIn.run(['.clear']);
const spaceTimeout = setTimeout(function() {
  throw new Error('timeout');
}, 1000);
testMe.complete(' ', common.mustSucceed((data) => {
  assert.strictEqual(data[1], '');
  assert.ok(data[0].includes('globalThis'));
  clearTimeout(spaceTimeout);
}));
testMe.complete('toSt', common.mustCall(function(error, data) {
  assert.deepStrictEqual(data, [['toString'], 'toSt']);
}));
putIn.run(['.clear']);
putIn.run([
  'var x = Object.create(null);',
  'x.a = 1;',
  'x.b = 2;',
  'var y = Object.create(x);',
  'y.a = 3;',
  'y.c = 4;',
]);
testMe.complete('y.', common.mustCall(function(error, data) {
  assert.deepStrictEqual(data, [['y.b', '', 'y.a', 'y.c'], 'y.']);
}));
putIn.run(['.clear']);
testMe.complete('require(\'', common.mustCall(function(error, data) {
  assert.strictEqual(error, null);
  publicModules.forEach((lib) => {
    assert(
      data[0].includes(lib) && data[0].includes(`node:${lib}`),
      `${lib} not found`
    );
  });
  const newModule = 'foobar';
  assert(!builtinModules.includes(newModule));
  repl.builtinModules.push(newModule);
  testMe.complete('require(\'', common.mustCall((_, [modules]) => {
    assert.strictEqual(data[0].length + 1, modules.length);
    assert(modules.includes(newModule));
  }));
}));
testMe.complete("require\t( 'n", common.mustCall(function(error, data) {
  assert.strictEqual(error, null);
  assert.strictEqual(data.length, 2);
  assert.strictEqual(data[1], 'n');
  publicModules.forEach((lib, index) =>
    assert.strictEqual(data[0][index], `node:${lib}`));
  assert.strictEqual(data[0][publicModules.length], '');
  assert.strictEqual(data[0][publicModules.length + 1], 'net');
  assert.strictEqual(data[0][publicModules.length + 2], '');
  data[0].slice(publicModules.length + 3).forEach((completion) => {
  });
}));
{
  for (const quotationMark of ["'", '"', '`']) {
    putIn.run(['.clear']);
    testMe.complete('require(`@nodejs', common.mustCall((err, data) => {
      assert.strictEqual(err, null);
      assert.deepStrictEqual(data, [expected, '@nodejs']);
    }));
    putIn.run(['.clear']);
    const input = `require(${quotationMark}@nodejsscope${quotationMark}`;
    testMe.complete(input, common.mustCall((err, data) => {
      assert.strictEqual(err, null);
      assert.deepStrictEqual(data, [[], undefined]);
    }));
  }
}
{
  putIn.run(['.clear']);
  testMe.complete('require \t("no_ind', common.mustCall((err, data) => {
    assert.strictEqual(err, null);
  }));
}
{
  putIn.run(['.clear']);
  const cwd = process.cwd();
  process.chdir(__dirname);
  ['require(\'.', 'require(".'].forEach((input) => {
    testMe.complete(input, common.mustCall((err, data) => {
      assert.strictEqual(err, null);
      assert.strictEqual(data.length, 2);
      assert.strictEqual(data[1], '.');
      assert.strictEqual(data[0].length, 2);
    }));
  });
  ['require(\'..', 'require("..'].forEach((input) => {
    testMe.complete(input, common.mustCall((err, data) => {
      assert.strictEqual(err, null);
    }));
  });
    [`require('${path}`, `require("${path}`].forEach((input) => {
      testMe.complete(input, common.mustCall((err, data) => {
        assert.strictEqual(err, null);
        assert.strictEqual(data.length, 2);
        assert.strictEqual(data[1], path);
      }));
    });
  });
    [`require('${path}`, `require("${path}`].forEach((input) => {
      testMe.complete(input, common.mustCall((err, data) => {
        assert.strictEqual(err, null);
        assert.strictEqual(data.length, 2);
        assert.strictEqual(data[1], path);
      }));
    });
  });
  {
    testMe.complete(`require('${path}`, common.mustSucceed((data) => {
      assert.strictEqual(data.length, 2);
      assert.strictEqual(data[1], path);
    }));
  }
  process.chdir(cwd);
}
putIn.run(['.clear']);
putIn.run([
  'var custom = "test";',
]);
testMe.complete('cus', common.mustCall(function(error, data) {
  assert.deepStrictEqual(data, [['custom'], 'cus']);
}));
putIn.run(['.clear']);
putIn.run([
  'var proxy = new Proxy({}, {ownKeys: () => { throw new Error(); }});',
]);
testMe.complete('proxy.', common.mustCall(function(error, data) {
  assert.strictEqual(error, null);
  assert(Array.isArray(data));
}));
putIn.run(['.clear']);
putIn.run(['var ary = [1,2,3];']);
testMe.complete('ary.', common.mustCall(function(error, data) {
  assert.strictEqual(data[0].includes('ary.0'), false);
  assert.strictEqual(data[0].includes('ary.1'), false);
  assert.strictEqual(data[0].includes('ary.2'), false);
}));
putIn.run(['.clear']);
putIn.run(['var obj = {1:"a","1a":"b",a:"b"};']);
testMe.complete('obj.', common.mustCall(function(error, data) {
  assert.strictEqual(data[0].includes('obj.1'), false);
  assert.strictEqual(data[0].includes('obj.1a'), false);
  assert(data[0].includes('obj.a'));
}));
putIn.run(['.clear']);
putIn.run(['function a() {}']);
testMe.complete('a().b.', getNoResultsFunction());
putIn.run(['.clear']);
putIn.run(['var obj = {1:"a","1a":"b",a:"b"};']);
testMe.complete(' obj.', common.mustCall((error, data) => {
  assert.strictEqual(data[0].includes('obj.1'), false);
  assert.strictEqual(data[0].includes('obj.1a'), false);
  assert(data[0].includes('obj.a'));
}));
putIn.run(['.clear']);
testMe.complete('var log = console.lo', common.mustCall((error, data) => {
  assert.deepStrictEqual(data, [['console.log'], 'console.lo']);
}));
putIn.run(['.clear']);
testMe.complete('.b', common.mustCall((error, data) => {
  assert.deepStrictEqual(data, [['break'], 'b']);
}));
putIn.run(['.clear']);
putIn.run(['var obj = {"hello, world!": "some string", "key": 123}']);
testMe.complete('obj.', common.mustCall((error, data) => {
  assert.strictEqual(data[0].includes('obj.hello, world!'), false);
  assert(data[0].includes('obj.key'));
}));
putIn.run(['.clear']);
putIn.run(['var obj = {};']);
testMe.complete('obj.', common.mustCall(function(error, data) {
  assert.strictEqual(data[0].includes('obj.__defineGetter__'), false);
  assert.strictEqual(data[0].includes('obj.__defineSetter__'), false);
  assert.strictEqual(data[0].includes('obj.__lookupGetter__'), false);
  assert.strictEqual(data[0].includes('obj.__lookupSetter__'), false);
  assert.strictEqual(data[0].includes('obj.__proto__'), true);
}));
{
  putIn.run(['.clear']);
  process.chdir(__dirname);
  const readFileSyncs = ['fs.readFileSync("', 'fs.promises.readFileSync("'];
  if (!common.isWindows) {
    readFileSyncs.forEach((readFileSync) => {
      testMe.complete(fixturePath, common.mustCall((err, data) => {
        assert.strictEqual(err, null);
        assert.ok(data[0][0].includes('.hiddenfiles'));
        assert.ok(data[0][1].includes('hellorandom.txt'));
        assert.ok(data[0][2].includes('helloworld.js'));
      }));
                      common.mustCall((err, data) => {
                        assert.strictEqual(err, null);
                        assert.ok(data[0][0].includes('hellorandom.txt'));
                        assert.ok(data[0][1].includes('helloworld.js'));
                      })
      );
                      common.mustCall((err, data) => {
                        assert.strictEqual(err, null);
                        assert.ok(data[0][0].includes('.hiddenfiles'));
                      })
      );
                      common.mustCall((err, data) => {
                        assert.strictEqual(err, null);
                        assert.strictEqual(data[0].length, 0);
                      })
      );
      const testPath = fixturePath.slice(0, -1);
      testMe.complete(testPath, common.mustCall((err, data) => {
        assert.strictEqual(err, null);
        assert.ok(data[0][0].includes('test-repl-tab-completion'));
        assert.strictEqual(
          data[1],
          path.basename(testPath)
        );
      }));
    });
  }
}
[
  Array,
  Buffer,
  Uint8Array,
  Uint16Array,
  Uint32Array,
  Uint8ClampedArray,
  Int8Array,
  Int16Array,
  Int32Array,
  Float32Array,
  Float64Array,
].forEach((type) => {
  putIn.run(['.clear']);
  if (type === Array) {
    putIn.run([
      'var ele = [];',
      'for (let i = 0; i < 1e6 + 1; i++) ele[i] = 0;',
      'ele.biu = 1;',
    ]);
  } else if (type === Buffer) {
    putIn.run(['var ele = Buffer.alloc(1e6 + 1); ele.biu = 1;']);
  } else {
    putIn.run([`var ele = new ${type.name}(1e6 + 1); ele.biu = 1;`]);
  }
  hijackStderr(common.mustNotCall());
  testMe.complete('ele.', common.mustCall((err, data) => {
    restoreStderr();
    assert.ifError(err);
    const ele = (type === Array) ?
      [] :
      (type === Buffer ?
        Buffer.alloc(0) :
        new type(0));
    assert.strictEqual(data[0].includes('ele.biu'), true);
    data[0].forEach((key) => {
      if (!key || key === 'ele.biu') return;
      assert.notStrictEqual(ele[key.substr(4)], undefined);
    });
  }));
});
putIn.run(['.clear']);
testMe.complete('Buffer.prototype.', common.mustCall());
const testNonGlobal = repl.start({
  input: putIn,
  output: putIn,
  useGlobal: false
});
const builtins = [['Infinity', 'Int16Array', 'Int32Array',
                   'Int8Array'], 'I'];
if (common.hasIntl) {
  builtins[0].push('Intl');
}
testNonGlobal.complete('I', common.mustCall((error, data) => {
  assert.deepStrictEqual(data, builtins);
}));
const customCompletions = 'aaa aa1 aa2 bbb bb1 bb2 bb3 ccc ddd eee'.split(' ');
const testCustomCompleterSyncMode = repl.start({
  prompt: '',
  input: putIn,
  output: putIn,
  completer: function completer(line) {
    const hits = customCompletions.filter((c) => c.startsWith(line));
    return [hits.length ? hits : customCompletions, line];
  }
});
testCustomCompleterSyncMode.complete('', common.mustCall((error, data) => {
  assert.deepStrictEqual(data, [
    customCompletions,
    '',
  ]);
}));
testCustomCompleterSyncMode.complete('a', common.mustCall((error, data) => {
  assert.deepStrictEqual(data, [
    'aaa aa1 aa2'.split(' '),
    'a',
  ]);
}));
const testCustomCompleterAsyncMode = repl.start({
  prompt: '',
  input: putIn,
  output: putIn,
  completer: function completer(line, callback) {
    const hits = customCompletions.filter((c) => c.startsWith(line));
    callback(null, [hits.length ? hits : customCompletions, line]);
  }
});
testCustomCompleterAsyncMode.complete('', common.mustCall((error, data) => {
  assert.deepStrictEqual(data, [
    customCompletions,
    '',
  ]);
}));
testCustomCompleterAsyncMode.complete('a', common.mustCall((error, data) => {
  assert.deepStrictEqual(data, [
    'aaa aa1 aa2'.split(' '),
    'a',
  ]);
}));
const editorStream = new ArrayStream();
const editor = repl.start({
  stream: editorStream,
  terminal: true,
  useColors: false
});
editorStream.run(['.clear']);
editorStream.run(['.editor']);
editor.completer('Uin', common.mustCall((error, data) => {
  assert.deepStrictEqual(data, [['Uint'], 'Uin']);
}));
editorStream.run(['.clear']);
editorStream.run(['.editor']);
editor.completer('var log = console.l', common.mustCall((error, data) => {
  assert.deepStrictEqual(data, [['console.log'], 'console.l']);
}));
{
  const stream = new ArrayStream();
  const testRepl = repl.start({ stream });
  stream.run([`
    let lexicalLet = true;
    const lexicalConst = true;
    class lexicalKlass {}
  `]);
  ['Let', 'Const', 'Klass'].forEach((type) => {
    const query = `lexical${type[0]}`;
    const expected = hasInspector ? [[`lexical${type}`], query] :
      [[], `lexical${type[0]}`];
    testRepl.complete(query, common.mustCall((error, data) => {
      assert.deepStrictEqual(data, expected);
    }));
  });
}
