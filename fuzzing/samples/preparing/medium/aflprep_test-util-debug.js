'use strict';
const assert = require('assert');
const util = require('util');
const [, , modeArgv, sectionArgv] = process.argv;
if (modeArgv === 'child')
  child(sectionArgv);
else
  parent();
function parent() {
  test('foo,tud,bar', true, 'tud');
  test('foo,tud', true, 'tud');
  test('tud,bar', true, 'tud');
  test('tud', true, 'tud');
  test('foo,bar', false, 'tud');
  test('', false, 'tud');
  test('###', true, '###');
  test('hi:)', true, 'hi:)');
  test('f$oo', true, 'f$oo');
  test('f$oo', false, 'f.oo');
  test('no-bar-at-all', false, 'bar');
  test('test-abc', true, 'test-abc');
  test('test-a', false, 'test-abc');
  test('test-*', true, 'test-abc');
  test('test-*c', true, 'test-abc');
  test('test-*abc', true, 'test-abc');
  test('abc-test', true, 'abc-test');
  test('a*-test', true, 'abc-test');
  test('*-test', true, 'abc-test');
}
function test(environ, shouldWrite, section, forceColors = false) {
  let expectErr = '';
  const expectOut = shouldWrite ? 'enabled\n' : 'disabled\n';
  const spawn = require('child_process').spawn;
  const child = spawn(process.execPath, [__filename, 'child', section], {
    env: Object.assign(process.env, {
      NODE_DEBUG: environ,
      FORCE_COLOR: forceColors ? 'true' : 'false'
    })
  });
  if (shouldWrite) {
    if (forceColors) {
      const { colors, styles } = util.inspect;
      const addCodes = (arr) => [`\x1B[${arr[0]}m`, `\x1B[${arr[1]}m`];
      const num = addCodes(colors[styles.number]);
      const str = addCodes(colors[styles.string]);
      const regexp = addCodes(colors[styles.regexp]);
      const start = `${section.toUpperCase()} ${num[0]}${child.pid}${num[1]}`;
      expectErr =
        `${start}: this { is: ${str[0]}'a'${str[1]} } ${debugging}\n` +
        `${start}: num=1 str=a obj={"foo":"bar"}\n`;
    } else {
      const start = `${section.toUpperCase()} ${child.pid}`;
      expectErr =
        `${start}: num=1 str=a obj={"foo":"bar"}\n`;
    }
  }
  let err = '';
  child.stderr.setEncoding('utf8');
  child.stderr.on('data', (c) => {
    err += c;
  });
  let out = '';
  child.stdout.setEncoding('utf8');
  child.stdout.on('data', (c) => {
    out += c;
  });
  child.on('close', common.mustCall((c) => {
    assert(!c);
    assert.strictEqual(err, expectErr);
    assert.strictEqual(out, expectOut);
    if (!forceColors) {
      test(environ, shouldWrite, section, true);
    }
  }));
}
function child(section) {
  const tty = require('tty');
  Object.defineProperty(process.stderr, 'hasColors', {
    value: tty.WriteStream.prototype.hasColors
  });
  const debug = util.debuglog(section, common.mustCall((cb) => {
    assert.strictEqual(typeof cb, 'function');
  }));
  debug('num=%d str=%s obj=%j', 1, 'a', { foo: 'bar' });
  console.log(debug.enabled ? 'enabled' : 'disabled');
}
