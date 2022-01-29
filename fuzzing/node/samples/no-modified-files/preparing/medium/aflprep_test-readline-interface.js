'use strict';
common.skipIfDumbTerminal();
const assert = require('assert');
const readline = require('readline');
const util = require('util');
const {
  getStringWidth,
  stripVTControlCharacters
const { EventEmitter, getEventListeners } = require('events');
const { Writable, Readable } = require('stream');
class FakeInput extends EventEmitter {
  resume() {}
  pause() {}
  write() {}
  end() {}
}
function isWarned(emitter) {
  for (const name in emitter) {
    const listeners = emitter[name];
    if (listeners.warned) return true;
  }
  return false;
}
function getInterface(options) {
  const fi = new FakeInput();
  const rli = new readline.Interface({
    input: fi,
    output: fi,
    ...options,
  });
  return [rli, fi];
}
function assertCursorRowsAndCols(rli, rows, cols) {
  const cursorPos = rli.getCursorPos();
  assert.strictEqual(cursorPos.rows, rows);
  assert.strictEqual(cursorPos.cols, cols);
}
{
  const input = new FakeInput();
  const rl = readline.Interface({ input });
  assert(rl instanceof readline.Interface);
}
[
  undefined,
  50,
  0,
  100.5,
  5000,
].forEach((crlfDelay) => {
  const [rli] = getInterface({ crlfDelay });
  assert.strictEqual(rli.crlfDelay, Math.max(crlfDelay || 100, 100));
  rli.close();
});
{
  const input = new FakeInput();
  ['not an array', 123, 123n, {}, true, Symbol(), null].forEach((invalid) => {
    assert.throws(() => {
      readline.createInterface({
        input,
        completer: invalid
      });
    }, {
      name: 'TypeError',
      code: 'ERR_INVALID_ARG_VALUE'
    });
  });
  ['not an array', 123, 123n, {}, true, Symbol(), null].forEach((history) => {
    assert.throws(() => {
      readline.createInterface({
        input,
        history,
      });
    }, {
      name: 'TypeError',
      code: 'ERR_INVALID_ARG_TYPE'
    });
  });
  ['not a number', -1, NaN, {}, true, Symbol(), null].forEach((historySize) => {
    assert.throws(() => {
      readline.createInterface({
        input,
        historySize,
      });
    }, {
      name: 'RangeError',
      code: 'ERR_INVALID_ARG_VALUE'
    });
  });
  assert.throws(
    () => new readline.Interface({
      input,
      tabSize: 0
    }),
    {
      message: 'The value of "tabSize" is out of range. ' +
                'It must be >= 1 && < 4294967296. Received 0',
      code: 'ERR_OUT_OF_RANGE'
    }
  );
  assert.throws(
    () => new readline.Interface({
      input,
      tabSize: '4'
    }),
    { code: 'ERR_INVALID_ARG_TYPE' }
  );
  assert.throws(
    () => new readline.Interface({
      input,
      tabSize: 4.5
    }),
    {
      code: 'ERR_OUT_OF_RANGE',
      message: 'The value of "tabSize" is out of range. ' +
                'It must be an integer. Received 4.5'
    }
  );
}
{
  const fi = new FakeInput();
  const rli = new readline.Interface(fi, {});
  rli.on('line', common.mustNotCall());
  fi.emit('data', 'a');
  rli.close();
}
{
  const [rli, fi] = getInterface({ terminal: true });
  const expectedLines = ['foo', 'bar', 'baz', 'bat'];
  rli.on('line', common.mustCall((line) => {
    assert.strictEqual(line, expectedLines.shift());
  }, expectedLines.length - 1));
  fi.emit('data', expectedLines.join('\r'));
  rli.close();
}
{
  const [rli, fi] = getInterface({ terminal: true });
  const expectedLines = ['', 'foo' ];
  rli.on('line', common.mustCall((line) => {
    assert.strictEqual(line, expectedLines.shift());
  }, expectedLines.length));
  fi.emit('data', '\rfoo\r');
  rli.close();
}
{
  const completer = (line) => [[], line];
  const [rli, fi] = getInterface({ terminal: true, completer });
  rli.on('line', common.mustCall((line) => {
    assert.strictEqual(line, 'foo');
  }));
  for (const character of '\tfo\to\t') {
    fi.emit('data', character);
  }
  fi.emit('data', '\n');
  rli.close();
}
{
  const [rli, fi] = getInterface({ terminal: true });
  rli.on('line', common.mustCall((line) => {
    assert.strictEqual(line, '\t');
  }));
  fi.emit('data', '\t');
  fi.emit('data', '\n');
  rli.close();
}
{
  const [rli, fi] = getInterface({ terminal: true });
  const expectedLines = ['foo', 'bar', 'baz', 'bat'];
  rli.on('history', common.mustCall((history) => {
    const expectedHistory = expectedLines.slice(0, history.length).reverse();
    assert.deepStrictEqual(history, expectedHistory);
  }, expectedLines.length));
  for (const line of expectedLines) {
    fi.emit('data', `${line}\n`);
  }
  rli.close();
}
{
  const [rli, fi] = getInterface({ terminal: true });
  const expectedLine = 'foo';
  rli.on('history', common.mustCall((history) => {
    assert.strictEqual(history[0], expectedLine);
    history.shift();
  }));
  rli.on('line', common.mustCall((line) => {
    assert.strictEqual(line, expectedLine);
    assert.strictEqual(rli.history.length, 0);
  }));
  fi.emit('data', `${expectedLine}\n`);
  rli.close();
}
{
  const [rli, fi] = getInterface({
    terminal: true,
    removeHistoryDuplicates: true
  });
  const expectedLines = ['foo', 'bar', 'baz', 'bar', 'bat', 'bat'];
  let callCount = 0;
  rli.on('line', (line) => {
    assert.strictEqual(line, expectedLines[callCount]);
    callCount++;
  });
  fi.emit('data', `${expectedLines.join('\n')}\n`);
  assert.strictEqual(callCount, expectedLines.length);
  assert.strictEqual(rli.line, expectedLines[--callCount]);
  assert.notStrictEqual(rli.line, expectedLines[--callCount]);
  assert.strictEqual(rli.line, expectedLines[--callCount]);
  assert.strictEqual(rli.line, expectedLines[--callCount]);
  assert.notStrictEqual(rli.line, expectedLines[--callCount]);
  assert.strictEqual(rli.line, expectedLines[--callCount]);
  assert.strictEqual(callCount, 0);
  assert.strictEqual(rli.line, 'baz');
  assert.strictEqual(rli.historyIndex, 2);
  assert.strictEqual(rli.line, 'bar');
  assert.strictEqual(rli.historyIndex, 1);
  fi.emit('keypress', '.', { name: 'n', ctrl: true });
  assert.strictEqual(rli.line, 'bat');
  assert.strictEqual(rli.historyIndex, 0);
  assert.strictEqual(rli.line, 'bat');
  assert.strictEqual(rli.historyIndex, -1);
  assert.strictEqual(rli.historyIndex, -1);
  assert.strictEqual(rli.line, 'ba');
  assert.strictEqual(rli.historyIndex, -1);
  assert.strictEqual(rli.line, 'ba');
  assert.strictEqual(rli.historyIndex, -1);
  assert.strictEqual(rli.line, 'ba');
  assert.strictEqual(rli.historyIndex, 0);
  assert.strictEqual(rli.line, 'bat');
  assert.strictEqual(rli.historyIndex, 1);
  assert.strictEqual(rli.line, 'bar');
  assert.strictEqual(rli.historyIndex, 2);
  assert.strictEqual(rli.line, 'baz');
  assert.strictEqual(rli.historyIndex, 4);
  assert.strictEqual(rli.line, 'ba');
  assert.strictEqual(rli.historyIndex, 4);
  assert.strictEqual(rli.line, 'ba');
  assert.strictEqual(rli.historyIndex, -1);
  assert.strictEqual(rli.line, 'ba');
  assert.strictEqual(rli.historyIndex, 0);
  assert.strictEqual(rli.line, 'bat');
  rli.close();
}
{
  const [rli, fi] = getInterface({
    terminal: true,
    removeHistoryDuplicates: false
  });
  const expectedLines = ['foo', 'bar', 'baz', 'bar', 'bat', 'bat'];
  let callCount = 0;
  rli.on('line', (line) => {
    assert.strictEqual(line, expectedLines[callCount]);
    callCount++;
  });
  fi.emit('data', `${expectedLines.join('\n')}\n`);
  assert.strictEqual(callCount, expectedLines.length);
  assert.strictEqual(rli.line, expectedLines[--callCount]);
  assert.notStrictEqual(rli.line, expectedLines[--callCount]);
  assert.strictEqual(rli.line, expectedLines[--callCount]);
  assert.strictEqual(rli.line, expectedLines[--callCount]);
  assert.strictEqual(rli.line, expectedLines[--callCount]);
  assert.strictEqual(rli.line, expectedLines[--callCount]);
  assert.strictEqual(callCount, 0);
  rli.close();
}
{
  const [rli, fi] = getInterface({ terminal: true });
  const keys = [];
  const err = new Error('bad thing happened');
  fi.on('keypress', (key) => {
    keys.push(key);
    if (key === 'X') {
      throw err;
    }
  });
  assert.throws(
    () => fi.emit('data', 'fooX'),
    (e) => {
      assert.strictEqual(e, err);
      return true;
    }
  );
  fi.emit('data', 'bar');
  assert.strictEqual(keys.join(''), 'fooXbar');
  rli.close();
}
{
  const [rli, fi] = getInterface({ terminal: true, historySize: 2 });
  const lines = ['line 1', 'line 2', 'line 3'];
  fi.emit('data', lines.join('\n') + '\n');
  assert.strictEqual(rli.history.length, 2);
  assert.strictEqual(rli.history[0], 'line 3');
  assert.strictEqual(rli.history[1], 'line 2');
}
{
  const [rli] = getInterface({ terminal: true });
  const expectedLines = ['foo'];
  rli.question(expectedLines[0], () => rli.close());
  assertCursorRowsAndCols(rli, 0, expectedLines[0].length);
  rli.close();
}
{
  const [rli] = getInterface({ terminal: true });
  const expectedLines = ['foo', 'bar'];
  rli.question(expectedLines.join('\n'), () => rli.close());
  assertCursorRowsAndCols(
    rli, expectedLines.length - 1, expectedLines.slice(-1)[0].length);
  rli.close();
}
{
  const [rli, fi] = getInterface({ terminal: true, prompt: '' });
  fi.emit('data', 'the quick brown fox');
  fi.emit('keypress', '.', { ctrl: true, name: 'a' });
  assertCursorRowsAndCols(rli, 0, 0);
  fi.emit('keypress', '.', { ctrl: true, name: 'e' });
  assertCursorRowsAndCols(rli, 0, 19);
  rli.close();
}
{
  const [rli, fi] = getInterface({ terminal: true, prompt: '' });
  fi.emit('data', 'the quick brown fox');
  assertCursorRowsAndCols(rli, 0, 19);
  fi.emit('keypress', '.', { ctrl: true, name: 'b' });
  assertCursorRowsAndCols(rli, 0, 18);
  fi.emit('keypress', '.', { ctrl: true, name: 'b' });
  assertCursorRowsAndCols(rli, 0, 17);
  fi.emit('keypress', '.', { ctrl: true, name: 'f' });
  assertCursorRowsAndCols(rli, 0, 18);
  fi.emit('keypress', '.', { ctrl: true, name: 'f' });
  assertCursorRowsAndCols(rli, 0, 19);
  rli.close();
}
{
  const [rli, fi] = getInterface({ terminal: true, prompt: '' });
  fi.emit('data', '💻');
  fi.emit('keypress', '.', { name: 'left' });
  assertCursorRowsAndCols(rli, 0, 0);
  fi.emit('keypress', '.', { name: 'right' });
  assertCursorRowsAndCols(rli, 0, 2);
  rli.on('line', common.mustCall((line) => {
    assert.strictEqual(line, '💻');
  }));
  fi.emit('data', '\n');
  rli.close();
}
{
  const [rli, fi] = getInterface({ terminal: true, prompt: '' });
  fi.emit('data', '💻');
  fi.emit('keypress', '.', { name: 'left' });
  assertCursorRowsAndCols(rli, 0, 0);
  fi.emit('data', '🐕');
  assertCursorRowsAndCols(rli, 0, 2);
  rli.on('line', common.mustCall((line) => {
    assert.strictEqual(line, '🐕💻');
  }));
  fi.emit('data', '\n');
  rli.close();
}
{
  const [rli, fi] = getInterface({ terminal: true, prompt: '' });
  fi.emit('data', '💻');
  fi.emit('keypress', '.', { name: 'right' });
  assertCursorRowsAndCols(rli, 0, 2);
  fi.emit('data', '🐕');
  assertCursorRowsAndCols(rli, 0, 4);
  rli.on('line', common.mustCall((line) => {
    assert.strictEqual(line, '💻🐕');
  }));
  fi.emit('data', '\n');
  rli.close();
}
{
  const [rli, fi] = getInterface({ terminal: true, prompt: '' });
  fi.emit('data', 'the quick brown fox');
  fi.emit('keypress', '.', { ctrl: true, name: 'left' });
  assertCursorRowsAndCols(rli, 0, 16);
  fi.emit('keypress', '.', { meta: true, name: 'b' });
  assertCursorRowsAndCols(rli, 0, 10);
  fi.emit('keypress', '.', { ctrl: true, name: 'right' });
  assertCursorRowsAndCols(rli, 0, 16);
  fi.emit('keypress', '.', { meta: true, name: 'f' });
  assertCursorRowsAndCols(rli, 0, 19);
  rli.close();
}
[
  { ctrl: true, name: 'w' },
  { ctrl: true, name: 'backspace' },
  { meta: true, name: 'backspace' },
].forEach((deleteWordLeftKey) => {
  let [rli, fi] = getInterface({ terminal: true, prompt: '' });
  fi.emit('data', 'the quick brown fox');
  fi.emit('keypress', '.', { ctrl: true, name: 'left' });
  rli.on('line', common.mustCall((line) => {
    assert.strictEqual(line, 'the quick fox');
  }));
  fi.emit('keypress', '.', deleteWordLeftKey);
  fi.emit('data', '\n');
  rli.close();
  [rli, fi] = getInterface({ terminal: true, prompt: '' });
  fi.emit('data', 'the quick brown fox');
  fi.emit('keypress', '.', { ctrl: true, name: 'a' });
  rli.on('line', common.mustCall((line) => {
    assert.strictEqual(line, 'the quick brown fox');
  }));
  fi.emit('keypress', '.', deleteWordLeftKey);
  fi.emit('data', '\n');
  rli.close();
});
[
  { ctrl: true, name: 'delete' },
  { meta: true, name: 'delete' },
  { meta: true, name: 'd' },
].forEach((deleteWordRightKey) => {
  let [rli, fi] = getInterface({ terminal: true, prompt: '' });
  fi.emit('data', 'the quick brown fox');
  fi.emit('keypress', '.', { ctrl: true, name: 'left' });
  fi.emit('keypress', '.', { ctrl: true, name: 'left' });
  rli.on('line', common.mustCall((line) => {
    assert.strictEqual(line, 'the quick fox');
  }));
  fi.emit('keypress', '.', deleteWordRightKey);
  fi.emit('data', '\n');
  rli.close();
  [rli, fi] = getInterface({ terminal: true, prompt: '' });
  fi.emit('data', 'the quick brown fox');
  rli.on('line', common.mustCall((line) => {
    assert.strictEqual(line, 'the quick brown fox');
  }));
  fi.emit('keypress', '.', deleteWordRightKey);
  fi.emit('data', '\n');
  rli.close();
});
{
  const [rli, fi] = getInterface({ terminal: true, prompt: '' });
  fi.emit('data', 'the quick brown fox');
  assertCursorRowsAndCols(rli, 0, 19);
  fi.emit('keypress', '.', { ctrl: true, name: 'h' });
  assertCursorRowsAndCols(rli, 0, 18);
  rli.on('line', common.mustCall((line) => {
    assert.strictEqual(line, 'the quick brown fo');
  }));
  fi.emit('data', '\n');
  rli.close();
}
{
  const [rli, fi] = getInterface({ terminal: true, prompt: '' });
  fi.emit('data', '💻');
  assertCursorRowsAndCols(rli, 0, 2);
  fi.emit('keypress', '.', { ctrl: true, name: 'h' });
  assertCursorRowsAndCols(rli, 0, 0);
  rli.on('line', common.mustCall((line) => {
    assert.strictEqual(line, '');
  }));
  fi.emit('data', '\n');
  rli.close();
}
{
  const [rli, fi] = getInterface({ terminal: true, prompt: '' });
  fi.emit('data', 'the quick brown fox');
  fi.emit('keypress', '.', { ctrl: true, name: 'a' });
  assertCursorRowsAndCols(rli, 0, 0);
  fi.emit('keypress', '.', { ctrl: true, name: 'd' });
  assertCursorRowsAndCols(rli, 0, 0);
  rli.on('line', common.mustCall((line) => {
    assert.strictEqual(line, 'he quick brown fox');
  }));
  fi.emit('data', '\n');
  rli.close();
}
{
  const [rli, fi] = getInterface({ terminal: true, prompt: '' });
  fi.emit('data', '💻');
  fi.emit('keypress', '.', { ctrl: true, name: 'a' });
  assertCursorRowsAndCols(rli, 0, 0);
  fi.emit('keypress', '.', { ctrl: true, name: 'd' });
  assertCursorRowsAndCols(rli, 0, 0);
  rli.on('line', common.mustCall((line) => {
    assert.strictEqual(line, '');
  }));
  fi.emit('data', '\n');
  rli.close();
}
{
  const [rli, fi] = getInterface({ terminal: true, prompt: '' });
  fi.emit('data', 'the quick brown fox');
  assertCursorRowsAndCols(rli, 0, 19);
  fi.emit('keypress', '.', { ctrl: true, shift: true, name: 'backspace' });
  assertCursorRowsAndCols(rli, 0, 0);
  rli.on('line', common.mustCall((line) => {
    assert.strictEqual(line, '');
  }));
  fi.emit('data', '\n');
  rli.close();
}
{
  const [rli, fi] = getInterface({ terminal: true, prompt: '' });
  fi.emit('data', 'the quick brown fox');
  fi.emit('keypress', '.', { ctrl: true, name: 'a' });
  assertCursorRowsAndCols(rli, 0, 0);
  fi.emit('keypress', '.', { ctrl: true, shift: true, name: 'delete' });
  assertCursorRowsAndCols(rli, 0, 0);
  rli.on('line', common.mustCall((line) => {
    assert.strictEqual(line, '');
  }));
  fi.emit('data', '\n');
  rli.close();
}
{
  const [rli, fi] = getInterface({ terminal: true, prompt: '' });
  fi.emit('keypress', '.', { ctrl: true, name: 'c' });
  assert(rli.closed);
}
{
  const [rli, fi] = getInterface({ terminal: true, prompt: '' });
  fi.columns = 10;
  fi.emit('data', 'multi-line text');
  assertCursorRowsAndCols(rli, 1, 5);
  rli.close();
}
{
  const [rli, fi] = getInterface({ tabSize: 16, terminal: true, prompt: '' });
  fi.columns = 10;
  fi.emit('data', 'multi-line\ttext \t');
  assert.strictEqual(rli.cursor, 17);
  assertCursorRowsAndCols(rli, 3, 2);
  rli.close();
}
{
  const [rli, fi] = getInterface({ terminal: true, prompt: '' });
  fi.emit('data', 'the quick\tbrown\tfox');
  assert.strictEqual(rli.cursor, 19);
  assertCursorRowsAndCols(rli, 0, 27);
}
{
  const [rli, fi] = getInterface({
    terminal: true,
    prompt: '\nfilledline\nwraping text\n> '
  });
  fi.columns = 10;
  fi.emit('data', 't');
  assertCursorRowsAndCols(rli, 4, 3);
  rli.close();
}
{
  const [rli, fi] = getInterface({ terminal: true, prompt: '' });
  const lines = ['line 1', 'line 2', 'line 3'];
  fi.emit('data', lines.join('\n'));
  fi.emit('keypress', '.', { ctrl: true, name: 'l' });
  assertCursorRowsAndCols(rli, 0, 6);
  rli.on('line', common.mustCall((line) => {
    assert.strictEqual(line, 'line 3');
  }));
  fi.emit('data', '\n');
  rli.close();
}
assert.strictEqual(getStringWidth('a'), 1);
assert.strictEqual(getStringWidth('あ'), 2);
assert.strictEqual(getStringWidth('谢'), 2);
assert.strictEqual(getStringWidth('고'), 2);
assert.strictEqual(getStringWidth(String.fromCodePoint(0x1f251)), 2);
assert.strictEqual(getStringWidth('abcde'), 5);
assert.strictEqual(getStringWidth('古池や'), 6);
assert.strictEqual(getStringWidth('ノード.js'), 9);
assert.strictEqual(getStringWidth('你好'), 4);
assert.strictEqual(getStringWidth('안녕하세요'), 10);
assert.strictEqual(getStringWidth('A\ud83c\ude00BC'), 5);
assert.strictEqual(getStringWidth('👨‍👩‍👦‍👦'), 8);
assert.strictEqual(getStringWidth('🐕𐐷あ💻😀'), 9);
assert.strictEqual(getStringWidth('⓬⓪'), 2);
assert.strictEqual(getStringWidth('\u0301\u200D\u200E'), 0);
assert.strictEqual(stripVTControlCharacters('\u001b[31m> \u001b[39m'), '> ');
assert.strictEqual(
  stripVTControlCharacters('\u001b[31m> \u001b[39m> '),
  '> > '
);
assert.strictEqual(stripVTControlCharacters('\u001b[31m\u001b[39m'), '');
assert.strictEqual(stripVTControlCharacters('> '), '> ');
assert.strictEqual(getStringWidth('\u001b[31m> \u001b[39m'), 2);
assert.strictEqual(getStringWidth('\u001b[31m> \u001b[39m> '), 4);
assert.strictEqual(getStringWidth('\u001b[31m\u001b[39m'), 0);
assert.strictEqual(getStringWidth('> '), 2);
for (let i = 0; i < 12; i++) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.close();
  assert.strictEqual(isWarned(process.stdin._events), false);
  assert.strictEqual(isWarned(process.stdout._events), false);
}
[true, false].forEach((terminal) => {
  {
    const [rli, fi] = getInterface({ terminal, historySize: 0 });
    assert.strictEqual(rli.historySize, 0);
    fi.emit('data', 'asdf\n');
    assert.deepStrictEqual(rli.history, []);
    rli.close();
  }
  {
    const [rli, fi] = getInterface({ terminal });
    assert.strictEqual(rli.historySize, 30);
    fi.emit('data', 'asdf\n');
    assert.deepStrictEqual(rli.history, terminal ? ['asdf'] : []);
    rli.close();
  }
  {
    const [rli, fi] = getInterface({ terminal });
    rli.on('line', common.mustCall((line) => {
      assert.strictEqual(line, 'asdf');
    }));
    fi.emit('data', 'asdf\n');
  }
  {
    const [rli, fi] = getInterface({ terminal });
    rli.on('line', common.mustCall((line) => {
      assert.strictEqual(line, '');
    }));
    fi.emit('data', '\n');
  }
  {
    const [rli, fi] = getInterface({ terminal });
    let called = false;
    rli.on('line', (line) => {
      called = true;
      assert.strictEqual(line, 'a');
    });
    fi.emit('data', 'a');
    assert.ok(!called);
    fi.emit('data', '\n');
    assert.ok(called);
    rli.close();
  }
  {
    const [rli, fi] = getInterface({ terminal });
    const expectedLines = ['foo', 'bar', 'baz'];
    rli.on('line', common.mustCall((line) => {
      assert.strictEqual(line, expectedLines.shift());
    }, expectedLines.length));
    fi.emit('data', `${expectedLines.join('\n')}\n`);
    rli.close();
  }
  {
    const [rli, fi] = getInterface({ terminal });
    const expectedLines = ['foo', 'bar', 'baz', 'bat'];
    rli.on('line', common.mustCall((line) => {
      assert.strictEqual(line, expectedLines.shift());
    }, expectedLines.length - 1));
    fi.emit('data', expectedLines.join('\n'));
    rli.close();
  }
  {
    const [rli, fi] = getInterface({ terminal });
    const expectedLines = ['foo', 'bar', 'baz', ''];
    rli.on('line', common.mustCall((line) => {
      assert.strictEqual(line, expectedLines.shift());
    }, expectedLines.length - 1));
    rli.on('close', common.mustCall());
    fi.emit('data', expectedLines.join('\n'));
    fi.emit('end');
    rli.close();
  }
  {
    const buf = Buffer.from('☮', 'utf8');
    const [rli, fi] = getInterface({ terminal });
    let callCount = 0;
    rli.on('line', (line) => {
      callCount++;
      assert.strictEqual(line, buf.toString('utf8'));
    });
    for (const i of buf) {
      fi.emit('data', Buffer.from([i]));
    }
    assert.strictEqual(callCount, 0);
    fi.emit('data', '\n');
    assert.strictEqual(callCount, 1);
    rli.close();
  }
  {
    const [rli, fi] = getInterface({ terminal });
    rli.on('line', common.mustCall((line) => {
      assert.strictEqual(line, 'asdf');
    }));
    fi.emit('data', 'asdf\n');
    rli.close();
  }
  {
    const [rli] = getInterface({ terminal });
    rli.question('foo?', common.mustCall((answer) => {
      assert.strictEqual(answer, 'bar');
    }));
    rli.write('bar\n');
    rli.close();
  }
  {
    const [rli] = getInterface({ terminal });
    rli.question('foo?', common.mustCall((answer) => {
      assert.strictEqual(answer, 'baz');
    }));
    rli.question('bar?', common.mustNotCall(() => {
    }));
    rli.write('baz\n');
    rli.close();
  }
  {
    const [rli] = getInterface({ terminal });
    const question = util.promisify(rli.question).bind(rli);
    question('foo?')
    .then(common.mustCall((answer) => {
      assert.strictEqual(answer, 'bar');
    }));
    rli.write('bar\n');
    rli.close();
  }
  {
    const ac = new AbortController();
    const signal = ac.signal;
    const [rli] = getInterface({ terminal });
    rli.on('line', common.mustCall((line) => {
      assert.strictEqual(line, 'bar');
    }));
    rli.question('hello?', { signal }, common.mustNotCall());
    ac.abort();
    rli.write('bar\n');
    rli.close();
  }
  {
    const ac = new AbortController();
    const signal = ac.signal;
    const [rli] = getInterface({ terminal });
    const question = util.promisify(rli.question).bind(rli);
    rli.on('line', common.mustCall((line) => {
      assert.strictEqual(line, 'bar');
    }));
    question('hello?', { signal })
    .then(common.mustNotCall())
    .catch(common.mustCall((error) => {
      assert.strictEqual(error.name, 'AbortError');
    }));
    ac.abort();
    rli.write('bar\n');
    rli.close();
  }
  {
    const signal = AbortSignal.abort();
    const [rli] = getInterface({ terminal });
    rli.pause();
    rli.on('resume', common.mustNotCall());
    rli.question('hello?', { signal }, common.mustNotCall());
    rli.close();
  }
  {
    const signal = AbortSignal.abort();
    const [rli] = getInterface({ terminal });
    const question = util.promisify(rli.question).bind(rli);
    rli.on('resume', common.mustNotCall());
    rli.pause();
    question('hello?', { signal })
    .then(common.mustNotCall())
    .catch(common.mustCall((error) => {
      assert.strictEqual(error.name, 'AbortError');
    }));
    rli.close();
  }
  {
    const [rli, fi] = getInterface({ output: null, terminal });
    rli.on('line', common.mustCall((line) => {
      assert.strictEqual(line, 'asdf');
    }));
    fi.emit('data', 'asdf\n');
    rli.setPrompt('ddd> ');
    rli.prompt();
    rli.write("really shouldn't be seeing this");
    rli.question('What do you think of node.js? ', (answer) => {
      console.log('Thank you for your valuable feedback:', answer);
      rli.close();
    });
  }
  {
    const expectedPrompts = ['$ ', '> '];
    const [rli] = getInterface({ terminal });
    for (const prompt of expectedPrompts) {
      rli.setPrompt(prompt);
      assert.strictEqual(rli.getPrompt(), prompt);
    }
  }
  {
    const expected = terminal ?
      ['\u001b[1G', '\u001b[0J', '$ ', '\u001b[3G'] :
      ['$ '];
    const output = new Writable({
      write: common.mustCall((chunk, enc, cb) => {
        assert.strictEqual(chunk.toString(), expected.shift());
        cb();
        rl.close();
      }, expected.length)
    });
    const rl = readline.createInterface({
      input: new Readable({ read: common.mustCall() }),
      output,
      prompt: '$ ',
      terminal
    });
    rl.prompt();
    assert.strictEqual(rl.getPrompt(), '$ ');
  }
  {
    const fi = new FakeInput();
    assert.deepStrictEqual(fi.listeners(terminal ? 'keypress' : 'data'), []);
  }
  {
    const crlfDelay = 200;
    const [rli, fi] = getInterface({ terminal, crlfDelay });
    let callCount = 0;
    rli.on('line', () => {
      callCount++;
    });
    fi.emit('data', '\r');
    setTimeout(common.mustCall(() => {
      fi.emit('data', '\n');
      assert.strictEqual(callCount, 2);
      rli.close();
    }), crlfDelay + 10);
  }
  const crlfDelay = Infinity;
  {
    const delay = 200;
    const [rli, fi] = getInterface({ terminal, crlfDelay });
    let callCount = 0;
    rli.on('line', () => {
      callCount++;
    });
    fi.emit('data', '\r');
    setTimeout(common.mustCall(() => {
      fi.emit('data', '\n');
      assert.strictEqual(callCount, 1);
      rli.close();
    }), delay);
  }
  {
    const [rli, fi] = getInterface({ terminal, crlfDelay });
    const expectedLines = ['foo', 'bar', 'baz', 'bat'];
    rli.on('line', common.mustCall((line) => {
      assert.strictEqual(line, expectedLines.shift());
    }, expectedLines.length - 1));
    fi.emit('data', expectedLines.join('\r\n'));
    rli.close();
  }
  {
    const [rli, fi] = getInterface({ terminal, crlfDelay });
    const expectedLines = ['foo', 'bar', 'baz', 'bat'];
    let callCount = 0;
    rli.on('line', common.mustCall((line) => {
      assert.strictEqual(line, expectedLines[callCount]);
      callCount++;
    }, expectedLines.length));
    expectedLines.forEach((line) => {
      fi.emit('data', `${line}\r`);
      fi.emit('data', '\n');
    });
    rli.close();
  }
  {
    const delay = 125;
    const [rli, fi] = getInterface({ terminal, crlfDelay });
    let callCount = 0;
    rli.on('line', () => callCount++);
    fi.emit('data', '\r');
    setTimeout(common.mustCall(() => {
      fi.emit('data', '\n');
      assert.strictEqual(callCount, 1);
      rli.close();
    }), delay);
  }
});
{
  const input = new Readable({
    read() {
      this.push(null);
    },
  });
  const output = new Writable({
    write: common.mustCall((data, encoding, cb) => {
      assert.strictEqual(rl.cursor, rl.line.length - 1);
      cb();
    }),
  });
  const rl = new readline.createInterface({
    input,
    output,
    terminal: true,
  });
  rl.line = `a${' '.repeat(1e6)}a`;
  rl.cursor = rl.line.length;
}
{
  const fi = new FakeInput();
  const signal = AbortSignal.abort();
  const rl = readline.createInterface({
    input: fi,
    output: fi,
    signal,
  });
  rl.on('close', common.mustCall());
  assert.strictEqual(getEventListeners(signal, 'abort').length, 0);
}
{
  const fi = new FakeInput();
  const ac = new AbortController();
  const { signal } = ac;
  const rl = readline.createInterface({
    input: fi,
    output: fi,
    signal,
  });
  assert.strictEqual(getEventListeners(signal, 'abort').length, 1);
  rl.on('close', common.mustCall());
  ac.abort();
  assert.strictEqual(getEventListeners(signal, 'abort').length, 0);
}
{
  const fi = new FakeInput();
  const ac = new AbortController();
  const { signal } = ac;
  const rl = readline.createInterface({
    input: fi,
    output: fi,
    signal,
  });
  assert.strictEqual(getEventListeners(signal, 'abort').length, 1);
  rl.close();
  assert.strictEqual(getEventListeners(signal, 'abort').length, 0);
}
{
  assert.throws(() => {
    readline.createInterface({
      input: new FakeInput(),
      signal: {},
    });
  }, {
    name: 'TypeError',
    code: 'ERR_INVALID_ARG_TYPE'
  });
}
