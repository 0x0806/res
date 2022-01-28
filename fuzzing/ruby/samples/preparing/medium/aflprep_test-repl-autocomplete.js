'use strict';
const stream = require('stream');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { inspect } = require('util');
common.skipIfDumbTerminal();
tmpdir.refresh();
process.throwDeprecation = true;
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
const BACKSPACE = { name: 'backspace' };
const TABULATION = { name: 'tab' };
const WORD_LEFT = { name: 'left', ctrl: true };
const WORD_RIGHT = { name: 'right', ctrl: true };
const GO_TO_END = { name: 'end' };
const SIGINT = { name: 'c', ctrl: true };
const ESCAPE = { name: 'escape', meta: true };
const prompt = '> ';
const tests = [
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
      yield TABULATION;
      yield SIGINT;
      yield TABULATION;
      yield SIGINT;
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
    allowBlockingCompletions: true,
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
