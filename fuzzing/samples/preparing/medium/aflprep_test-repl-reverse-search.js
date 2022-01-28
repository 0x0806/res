'use strict';
const stream = require('stream');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { inspect } = require('util');
common.skipIfDumbTerminal();
common.allowGlobals('aaaa');
tmpdir.refresh();
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
const BACKSPACE = { name: 'backspace' };
const SEARCH_BACKWARDS = { name: 'r', ctrl: true };
const SEARCH_FORWARDS = { name: 's', ctrl: true };
const ESCAPE = { name: 'escape' };
const CTRL_C = { name: 'c', ctrl: true };
const DELETE_WORD_LEFT = { name: 'w', ctrl: true };
const prompt = '> ';
const tests = [
    env: { NODE_REPL_HISTORY: defaultHistoryPath },
    test: [
      'console.log("foo")', ENTER,
      'ab = "aaaa"', ENTER,
      'repl.repl.historyIndex', ENTER,
      'console.log("foo")', ENTER,
      'let ba = 9', ENTER,
      'ab = "aaaa"', ENTER,
      '555 - 909', ENTER,
      '{key : {key2 :[] }}', ENTER,
      'Array(100).fill(1)', ENTER,
    ],
    expected: [],
    clean: false
  },
  {
    env: { NODE_REPL_HISTORY: defaultHistoryPath },
    showEscapeCodes: true,
    checkTotal: true,
    useColors: true,
    test: [
      SEARCH_FORWARDS,
      'a',
      SEARCH_FORWARDS,
      'a',
      DELETE_WORD_LEFT,
      SEARCH_BACKWARDS,
      SEARCH_BACKWARDS,
      SEARCH_FORWARDS,
      ENTER,
    ],
    expected: [
      '\x1B[1G', '\x1B[0J',
      prompt, '\x1B[3G',
      '7',
      '\nfwd-i-search: _', '\x1B[1A', '\x1B[4G',
      '\x1B[3G', '\x1B[0J',
      '7\nfwd-i-search: _', '\x1B[1A', '\x1B[4G',
      '\x1B[3G', '\x1B[0J',
      '7\nfailed-fwd-i-search: a_', '\x1B[1A', '\x1B[4G',
      '\x1B[3G', '\x1B[0J',
      'Arr\x1B[4ma\x1B[24my(100).fill(1)\nbck-i-search: a_',
      '\x1B[1A', '\x1B[6G',
      '\x1B[3G', '\x1B[0J',
      '7\nfailed-fwd-i-search: a_', '\x1B[1A', '\x1B[4G',
      '\x1B[3G', '\x1B[0J',
      'Arr\x1B[4ma\x1B[24my(100).fill(1)\nbck-i-search: a_',
      '\x1B[1A', '\x1B[6G',
      '\x1B[3G', '\x1B[0J',
      'ab = "aa\x1B[4maa\x1B[24m"\nbck-i-search: aa_',
      '\x1B[1A', '\x1B[11G',
      '\x1B[3G', '\x1B[0J',
      'Arr\x1B[4ma\x1B[24my(100).fill(1)\nbck-i-search: a_',
      '\x1B[1A', '\x1B[6G',
      '\x1B[3G', '\x1B[0J',
      '7\nbck-i-search: _', '\x1B[1A', '\x1B[4G',
      '\x1B[3G', '\x1B[0J',
      'Arr\x1B[4ma\x1B[24my(100).fill(1)\nbck-i-search: a_',
      '\x1B[1A', '\x1B[6G',
      '\x1B[3G', '\x1B[0J',
      'ab = "aa\x1B[4maa\x1B[24m"\nbck-i-search: aa_',
      '\x1B[1A', '\x1B[11G',
      '\x1B[3G', '\x1B[0J',
      'ab = "a\x1B[4maa\x1B[24ma"\nbck-i-search: aa_',
      '\x1B[1A', '\x1B[10G',
      '\x1B[3G', '\x1B[0J',
      'ab = "\x1B[4maa\x1B[24maa"\nbck-i-search: aa_',
      '\x1B[1A', '\x1B[9G',
      '\x1B[3G', '\x1B[0J',
      '7\nfailed-bck-i-search: aa_', '\x1B[1A', '\x1B[4G',
      '\x1B[3G', '\x1B[0J',
      '7\nfailed-bck-i-search: aa_', '\x1B[1A', '\x1B[4G',
      '\x1B[3G', '\x1B[0J',
      'ab = "\x1B[4maa\x1B[24maa"\nfwd-i-search: aa_',
      '\x1B[1A', '\x1B[9G',
      '\x1B[3G', '\x1B[0J',
      '7',
      '\r\n',
      '\x1B[33m7\x1B[39m\n',
      '\x1B[1G', '\x1B[0J',
      prompt,
      '\x1B[3G',
      '\r\n',
    ],
    clean: false
  },
  {
    env: { NODE_REPL_HISTORY: defaultHistoryPath },
    showEscapeCodes: true,
    skip: !process.features.inspector,
    checkTotal: true,
    useColors: false,
    test: [
      SEARCH_BACKWARDS,
      SEARCH_BACKWARDS,
      CTRL_C,
      ENTER,
      '+',
      '2',
      're',
      DOWN,
      '\n',
    ],
    expected: [
      '\x1B[1G', '\x1B[0J',
      prompt, '\x1B[3G',
      '\x1B[5G', '\x1B[0K',
      '\nbck-i-search: _', '\x1B[1A', '\x1B[5G',
      '\x1B[3G', '\x1B[0J',
      '{key : {key2 :[] }}\nbck-i-search: }_', '\x1B[1A', '\x1B[21G',
      '\x1B[3G', '\x1B[0J',
      '{key : {key2 :[] }}\nbck-i-search: }_', '\x1B[1A', '\x1B[20G',
      '\x1B[3G', '\x1B[0J',
      'fu',
      '\r\n',
      '\x1B[1G', '\x1B[0J',
      prompt, '\x1B[3G',
      '\x1B[1B', '\x1B[2K', '\x1B[1A',
      '\r\n',
      '2\n',
      '\x1B[1G', '\x1B[0J',
      prompt, '\x1B[3G',
      '\nbck-i-search: _', '\x1B[1A',
      '\x1B[3G', '\x1B[0J',
      '1+1\nbck-i-search: +_', '\x1B[1A', '\x1B[4G',
      '\x1B[3G', '\x1B[0J',
      '1+1', '\x1B[4G',
      '\x1B[2C',
      '\r\n',
      '2\n',
      '\x1B[1G', '\x1B[0J',
      prompt, '\x1B[3G',
      '\x1B[1B', '\x1B[2K', '\x1B[1A',
      '\nbck-i-search: _', '\x1B[1A', '\x1B[4G',
      '\x1B[3G', '\x1B[0J',
      'Array(100).fill(1)\nbck-i-search: r_', '\x1B[1A', '\x1B[5G',
      '\x1B[3G', '\x1B[0J',
      'repl.repl.historyIndex\nbck-i-search: re_', '\x1B[1A', '\x1B[8G',
      '\x1B[3G', '\x1B[0J',
      'repl.repl.historyIndex', '\x1B[8G',
      '\x1B[1G', '\x1B[0J',
      `${prompt}ab = "aaaa"`, '\x1B[14G',
      '\x1B[1G', '\x1B[0J',
      '\x1B[25G', '\x1B[1A',
      '\x1B[1B', '\x1B[2K', '\x1B[1A',
      '\nfwd-i-search: _', '\x1B[1A', '\x1B[25G',
      '\x1B[3G', '\x1B[0J',
      'repl.repl.historyIndex',
      '\r\n',
      '-1\n',
      '\x1B[1G', '\x1B[0J',
      prompt, '\x1B[3G',
      '\r\n',
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
    useColors: opts.useColors || false,
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
    repl.inputStream.run(opts.test);
  });
}
runTest();
