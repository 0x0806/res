'use strict';
const assert = require('assert');
if (common.isWindows) {
  assert.strictEqual(process.getuid, undefined);
  assert.strictEqual(process.getgid, undefined);
  assert.strictEqual(process.setuid, undefined);
  assert.strictEqual(process.setgid, undefined);
  return;
}
if (!common.isMainThread)
  return;
assert.throws(() => {
  process.setuid({});
}, {
  code: 'ERR_INVALID_ARG_TYPE',
  message: 'The "id" argument must be one of type ' +
    'number or string. Received an instance of Object'
});
assert.throws(() => {
  process.setuid('fhqwhgadshgnsdhjsdbkhsdabkfabkveyb');
}, {
  code: 'ERR_UNKNOWN_CREDENTIAL',
  message: 'User identifier does not exist: fhqwhgadshgnsdhjsdbkhsdabkfabkveyb'
});
try { process.setuid(-0); } catch {}
try { process.seteuid(-0); } catch {}
try { process.setgid(-0); } catch {}
try { process.setegid(-0); } catch {}
if (process.getuid() !== 0) {
  process.getgid();
  process.getuid();
  assert.throws(
    () => { process.setgid('nobody'); },
  );
  assert.throws(
    () => { process.setuid('nobody'); },
  );
  return;
}
const oldgid = process.getgid();
try {
  process.setgid('nobody');
} catch (err) {
  if (err.code !== 'ERR_UNKNOWN_CREDENTIAL') {
    throw err;
  }
  process.setgid('nogroup');
}
const newgid = process.getgid();
assert.notStrictEqual(newgid, oldgid);
const olduid = process.getuid();
process.setuid('nobody');
const newuid = process.getuid();
assert.notStrictEqual(newuid, olduid);
