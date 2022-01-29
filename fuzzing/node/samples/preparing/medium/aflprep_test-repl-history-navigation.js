'use strict';
const stream = require('stream');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { inspect } = require('util');
common.skipIfDumbTerminal();
tmpdir.refresh();
process.throwDeprecation = true;
process.on('warning', common.mustNotCall());
const defaultHistoryPath = path.join(tmpdir.path, '.node_repl_history');
class ActionStream extends stream.Stream {
  run(data) {
    const _iter = data[Symbol.iterator]();
    const doAction = () => {
      const next = _iter.next();
      if (next.done) {
        this.emit('keypress', '', { ctrl: true, name: 'd' });
        return;
      }
      const action = next.value;
      if (typeof action === 'object') {
        this.emit('keypress', '', action);
      } else {
        this.emit('data', `${action}`);
      }
      setImmediate(doAction);
    };
    doAction();
  }
  resume() {}
  pause() {}
}
ActionStream.prototype.readable = true;
const ENTER = { name: 'enter' };
const UP = { name: 'up' };
const DOWN = { name: 'down' };
const LEFT = { name: 'left' };
const RIGHT = { name: 'right' };
const DELETE = { name: 'delete' };
const BACKSPACE = { name: 'backspace' };
const WORD_LEFT = { name: 'left', ctrl: true };
const WORD_RIGHT = { name: 'right', ctrl: true };
const GO_TO_END = { name: 'end' };
const DELETE_WORD_LEFT = { name: 'backspace', ctrl: true };
const SIGINT = { name: 'c', ctrl: true };
const ESCAPE = { name: 'escape', meta: true };
const prompt = '> ';
const WAIT = '€';
const prev = process.features.inspector;
let completions = 0;
const tests = [
    env: { NODE_REPL_HISTORY: defaultHistoryPath },
    test: [ 'let ab = 45', ENTER,
            '555 + 909', ENTER,
            '{key : {key2 :[] }}', ENTER,
            'Array(100).fill(1).map((e, i) => i ** i)', LEFT, LEFT, DELETE,
            '2', ENTER],
    expected: [],
    clean: false
  },
  {
    env: { NODE_REPL_HISTORY: defaultHistoryPath },
    test: [UP, UP, UP, UP, UP, DOWN, DOWN, DOWN, DOWN, DOWN],
    expected: [prompt,
               `${prompt}Array(100).fill(1).map((e, i) => i ** 2)`,
                 '144, 169, 196, 225, 256, 289, 324, 361, 400, 441, 484, 529,' +
                 ' 576, 625, 676, 729, 784, 841, 900, 961, 1024, 1089, 1156, ' +
                 '1225, 1296, 1369, 1444, 1521, 1600, 1681, 1764, 1849, 1936,' +
                 ' 2025, 2116, 2209,...',
               `${prompt}{key : {key2 :[] }}`,
               `${prompt}555 + 909`,
               `${prompt}let ab = 45`,
               prompt,
               `${prompt}let ab = 45`,
               `${prompt}555 + 909`,
               `${prompt}{key : {key2 :[] }}`,
               `${prompt}Array(100).fill(1).map((e, i) => i ** 2)`,
                 '144, 169, 196, 225, 256, 289, 324, 361, 400, 441, 484, 529,' +
                 ' 576, 625, 676, 729, 784, 841, 900, 961, 1024, 1089, 1156, ' +
                 '1225, 1296, 1369, 1444, 1521, 1600, 1681, 1764, 1849, 1936,' +
                 ' 2025, 2116, 2209,...',
               prompt].filter((e) => typeof e === 'string'),
    clean: false
  },
    env: { NODE_REPL_HISTORY: defaultHistoryPath },
    test: [
      'const foo = true', ENTER,
      '555n + 111n', ENTER,
      '5 + 5', ENTER,
      '55 - 13 === 42', ENTER,
    ],
    expected: [],
    clean: false
  },
  {
    env: { NODE_REPL_HISTORY: defaultHistoryPath },
    checkTotal: true,
    preview: false,
    showEscapeCodes: true,
    test: [
      '55', UP, UP, UP, UP, UP, UP, ENTER,
    ],
    expected: [
      '\x1B[1G', '\x1B[0J', prompt, '\x1B[3G',
      '5', '5',
      '\x1B[1G', '\x1B[0J',
      '> 55 - 13 === 42', '\x1B[17G',
      '\x1B[1G', '\x1B[0J',
      '> 555n + 111n', '\x1B[14G',
      '\x1B[1G', '\x1B[0J',
      '> 555 + 909', '\x1B[12G',
      '\x1B[1G', '\x1B[0J',
      '> 55', '\x1B[5G',
      '\r\n', '55\n',
      '\x1B[1G', '\x1B[0J',
      '> ', '\x1B[3G',
      '\r\n',
    ],
    clean: true
  },
  {
    env: { NODE_REPL_HISTORY: defaultHistoryPath },
    skip: !process.features.inspector,
    test: [
      ENTER,
      ENTER,
      ENTER,
      ENTER,
      ENTER,
      ENTER,
      ENTER,
      `const ${'veryLongName'.repeat(30)} = 'I should be previewed'`,
      ENTER,
      'const e = new RangeError("visible\\ninvisible")',
      ENTER,
      'e',
      ENTER,
      'veryLongName'.repeat(30),
      ENTER,
      `${'\x1B[90m \x1B[39m'.repeat(235)} fun`,
      ESCAPE,
      ENTER,
      `${' '.repeat(236)} fun`,
      ESCAPE,
      ENTER,
    ],
    expected: [],
    clean: false
  },
  {
    env: { NODE_REPL_HISTORY: defaultHistoryPath },
    columns: 250,
    checkTotal: true,
    showEscapeCodes: true,
    skip: !process.features.inspector,
    test: [
      UP,
      UP,
      UP,
      WORD_LEFT,
      UP,
      BACKSPACE,
      'x1',
      BACKSPACE,
      '2',
      BACKSPACE,
      '3',
      BACKSPACE,
      '4',
      DELETE_WORD_LEFT,
      'y1',
      BACKSPACE,
      '2',
      BACKSPACE,
      '3',
      SIGINT,
    ],
    expected: [
      '\x1B[1G', '\x1B[0J',
      prompt, '\x1B[3G',
      '\x1B[1G', '\x1B[0J',
      `${prompt}${' '.repeat(236)} fun`, '\x1B[243G',
      '\x1B[0K',
      '\x1B[1G', '\x1B[0J',
      `${prompt}${' '.repeat(235)} fun`, '\x1B[242G',
      '\x1B[0K',
      '\x1B[1G', '\x1B[0J',
      `${prompt}${'veryLongName'.repeat(30)}`, '\x1B[113G',
      '\x1B[1B', '\x1B[2K', '\x1B[1A',
      '\x1B[1A',
      '\x1B[1G', '\x1B[0J',
      `${prompt}${'veryLongName'.repeat(30)}`, '\x1B[3G', '\x1B[1A',
      '\x1B[2B', '\x1B[2K', '\x1B[2A',
      '\x1B[1G', '\x1B[0J',
      `${prompt}e`, '\x1B[4G',
      '\x1B[1B', '\x1B[2K', '\x1B[1A',
      '\x1B[1G', '\x1B[0J',
      '> ', '\x1B[3G', 'x', '1',
      '\x1B[5G', '\x1B[1A',
      '\x1B[1B', '\x1B[2K', '\x1B[1A',
      '\x1B[1G', '\x1B[0J',
      '> x', '\x1B[4G', '2',
      '\x1B[5G', '\x1B[1A',
      '\x1B[1B', '\x1B[2K', '\x1B[1A',
      '\x1B[1G', '\x1B[0J',
      '> x', '\x1B[4G', '3',
      '\x1B[5G', '\x1B[1A',
      '\x1B[1B', '\x1B[2K', '\x1B[1A',
      '\x1B[1G', '\x1B[0J',
      '> x', '\x1B[4G', '4',
      '\x1B[5G', '\x1B[1A',
      '\x1B[1B', '\x1B[2K', '\x1B[1A',
      '\x1B[1G', '\x1B[0J',
      '> ', '\x1B[3G', 'y', '1',
      '\x1B[5G', '\x1B[1A',
      '\x1B[1B', '\x1B[2K', '\x1B[1A',
      '\x1B[1G', '\x1B[0J',
      '> y', '\x1B[4G', '2',
      '\x1B[5G', '\x1B[1A',
      '\x1B[1B', '\x1B[2K', '\x1B[1A',
      '\x1B[1G', '\x1B[0J',
      '> y', '\x1B[4G', '3',
      '\x1B[5G', '\x1B[1A',
      '\x1B[1B', '\x1B[2K', '\x1B[1A',
      '\r\n',
      '\x1B[1G', '\x1B[0J',
      '> ', '\x1B[3G',
      '\r\n',
    ],
    clean: true
  },
  {
    env: { NODE_REPL_HISTORY: defaultHistoryPath },
    showEscapeCodes: true,
    skip: !process.features.inspector,
    checkTotal: true,
    test: [
      'fu',
      'n',
      RIGHT,
      BACKSPACE,
      LEFT,
      LEFT,
      'A',
      BACKSPACE,
      GO_TO_END,
      BACKSPACE,
      WORD_LEFT,
      WORD_RIGHT,
      ESCAPE,
      ENTER,
      UP,
      LEFT,
      ENTER,
      UP,
      ENTER,
    ],
    expected: [
      '\x1B[1G', '\x1B[0J', prompt, '\x1B[3G', 'f',
      '\x1B[0K',
      '\x1B[0K',
      'ction',
      '\x1B[1G', '\x1B[0J', `${prompt}functio`, '\x1B[10G',
      '\x1B[0K',
      '\x1B[10G', '\x1B[0K', '\x1B[9G',
      '\x1B[10G', '\x1B[0K', '\x1B[8G',
      '\x1B[1G', '\x1B[0J', `${prompt}functAio`, '\x1B[9G',
      '\x1B[8G', '\x1B[10G',
      '\x1B[0K', '\x1B[8G', '\x1B[2C',
      'n',
      '\x1B[1G', '\x1B[0J', `${prompt}functio`, '\x1B[10G',
      '\r\n',
      'Uncaught ReferenceError: functio is not defined\n',
      '\x1B[1G', '\x1B[0J',
      prompt, '\x1B[3G', '\x1B[1G', '\x1B[0J',
      `${prompt}functio`, '\x1B[10G',
      '\x1B[0K', '\x1B[1D',
      '\x1B[0K', '\x1B[9G', '\x1B[1C',
      '\r\n',
      'Uncaught ReferenceError: functio is not defined\n',
      '\x1B[1G', '\x1B[0J',
      '> ', '\x1B[3G',
      '\x1B[1G', '\x1B[0J',
      '> functio', '\x1B[10G',
      'n', '\r\n',
      '\x1B[1G', '\x1B[0J',
      '... ', '\x1B[5G',
      '\r\n',
    ],
    clean: true
  },
  {
    env: { NODE_REPL_HISTORY: defaultHistoryPath },
    skip: !process.features.inspector,
    test: [
      'util.inspect.replDefaults.showHidden',
      ENTER,
    ],
    expected: [],
    clean: false
  },
  {
    env: { NODE_REPL_HISTORY: defaultHistoryPath },
    skip: !process.features.inspector,
    checkTotal: true,
    test: [
      '[ ]',
      WORD_LEFT,
      WORD_LEFT,
      UP,
      ' = true',
      ENTER,
      '[ ]',
      ENTER,
    ],
    expected: [
      prompt,
      '[', ' ', ']',
      '> util.inspect.replDefaults.showHidden',
      ' ', '=', ' ', 't', 'r', 'u', 'e',
      'true\n',
      '> ', '[', ' ', ']',
      '[ [length]: 0 ]\n',
      '> ',
    ],
    clean: true
  },
  {
    env: { NODE_REPL_HISTORY: defaultHistoryPath },
    completer(line, callback) {
      if (line.endsWith(WAIT)) {
        if (completions++ === 0) {
          callback(null, [[`${WAIT}WOW`], line]);
        } else {
          setTimeout(callback, 1000, null, [[`${WAIT}WOW`], line]).unref();
        }
      } else {
        callback(null, [[' Always visible'], line]);
      }
    },
    skip: !process.features.inspector,
    test: [
      BACKSPACE,
      's',
      BACKSPACE,
      BACKSPACE,
      's',
      BACKSPACE,
    ],
    expected: [
      prompt,
      WAIT,
      prompt,
      's',
      prompt,
      WAIT,
      prompt,
      's',
      prompt,
    ],
    clean: true
  },
  {
    env: { NODE_REPL_HISTORY: defaultHistoryPath },
    test: (function*() {
      yield 'const ArrayIteratorPrototype =';
      yield '  Object.getPrototypeOf(Array.prototype[Symbol.iterator]());';
      yield ENTER;
      yield 'const {next} = ArrayIteratorPrototype;';
      yield ENTER;
      yield 'const realArrayIterator = Array.prototype[Symbol.iterator];';
      yield ENTER;
      yield 'delete Array.prototype[Symbol.iterator];';
      yield ENTER;
      yield 'delete ArrayIteratorPrototype.next;';
      yield ENTER;
      yield UP;
      yield UP;
      yield DOWN;
      yield DOWN;
      yield 'fu';
      yield 'n';
      yield RIGHT;
      yield BACKSPACE;
      yield LEFT;
      yield LEFT;
      yield 'A';
      yield BACKSPACE;
      yield GO_TO_END;
      yield BACKSPACE;
      yield WORD_LEFT;
      yield WORD_RIGHT;
      yield ESCAPE;
      yield ENTER;
      yield 'Array.proto';
      yield RIGHT;
      yield '.pu';
      yield ENTER;
      yield 'ArrayIteratorPrototype.next = next;';
      yield ENTER;
      yield 'Array.prototype[Symbol.iterator] = realArrayIterator;';
      yield ENTER;
    })(),
    expected: [],
    clean: false
  },
  {
    env: { NODE_REPL_HISTORY: defaultHistoryPath },
    test: ['const util = {}', ENTER,
           'ut', RIGHT, ENTER],
    expected: [
      prompt, ...'const util = {}',
      'undefined\n',
      '{}\n',
      prompt,
    ],
    clean: false
  },
  {
    env: { NODE_REPL_HISTORY: defaultHistoryPath },
    test: [
      'const utilDesc = Reflect.getOwnPropertyDescriptor(globalThis, "util")',
      ENTER,
      'globalThis.util = {}', ENTER,
      'ut', RIGHT, ENTER,
      'Reflect.defineProperty(globalThis, "util", utilDesc)', ENTER],
    expected: [
      prompt, ...'const utilDesc = ' +
      'Reflect.getOwnPropertyDescriptor(globalThis, "util")',
      'undefined\n',
      prompt, ...'globalThis.util = {}',
      '{}\n',
      '{}\n',
      prompt, ...'Reflect.defineProperty(globalThis, "util", utilDesc)',
      'true\n',
      prompt,
    ],
    clean: false
  },
];
const numtests = tests.length;
const runTestWrap = common.mustCall(runTest, numtests);
function cleanupTmpFile() {
  try {
    fs.writeFileSync(defaultHistoryPath, '');
  } catch (err) {
    if (err.code === 'ENOENT') return true;
    throw err;
  }
  return true;
}
function runTest() {
  const opts = tests.shift();
  const { expected, skip } = opts;
  if (skip) {
    setImmediate(runTestWrap, true);
    return;
  }
  const lastChunks = [];
  let i = 0;
  REPL.createInternalRepl(opts.env, {
    input: new ActionStream(),
    output: new stream.Writable({
      write(chunk, _, next) {
        const output = chunk.toString();
        if (!opts.showEscapeCodes &&
          return next();
        }
        lastChunks.push(output);
        if (expected.length && !opts.checkTotal) {
          try {
            assert.strictEqual(output, expected[i]);
          } catch (e) {
            console.error(`Failed test # ${numtests - tests.length}`);
            console.error('Last outputs: ' + inspect(lastChunks, {
              breakLength: 5, colors: true
            }));
            throw e;
          }
          i++;
        }
        next();
      }
    }),
    completer: opts.completer,
    prompt,
    useColors: false,
    preview: opts.preview,
    terminal: true
  }, function(err, repl) {
    if (err) {
      console.error(`Failed test # ${numtests - tests.length}`);
      throw err;
    }
    repl.once('close', () => {
      if (opts.clean)
        cleanupTmpFile();
      if (opts.checkTotal) {
        assert.deepStrictEqual(lastChunks, expected);
      } else if (expected.length !== i) {
        console.error(tests[numtests - tests.length - 1]);
        throw new Error(`Failed test # ${numtests - tests.length}`);
      }
      setImmediate(runTestWrap, true);
    });
    if (opts.columns) {
      Object.defineProperty(repl, 'columns', {
        value: opts.columns,
        enumerable: true
      });
    }
    repl.input.run(opts.test);
  });
}
runTest();
