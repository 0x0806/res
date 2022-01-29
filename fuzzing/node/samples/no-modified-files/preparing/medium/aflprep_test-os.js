'use strict';
const assert = require('assert');
const os = require('os');
const path = require('path');
const { inspect } = require('util');
const is = {
  number: (value, key) => {
    assert(!Number.isNaN(value), `${key} should not be NaN`);
    assert.strictEqual(typeof value, 'number');
  },
  string: (value) => { assert.strictEqual(typeof value, 'string'); },
  array: (value) => { assert.ok(Array.isArray(value)); },
  object: (value) => {
    assert.strictEqual(typeof value, 'object');
    assert.notStrictEqual(value, null);
  }
};
if (common.isWindows) {
  process.env.TEMP = '';
  process.env.TMP = '';
  const expected = `${process.env.SystemRoot || process.env.windir}\\temp`;
  assert.strictEqual(os.tmpdir(), expected);
  process.env.TEMP = '\\temp\\';
  assert.strictEqual(os.tmpdir(), '\\temp');
  process.env.TEMP = '\\';
  assert.strictEqual(os.tmpdir(), '\\');
  process.env.TEMP = 'C:\\';
  assert.strictEqual(os.tmpdir(), 'C:\\');
} else {
  process.env.TMPDIR = '';
  process.env.TMP = '';
  process.env.TEMP = '';
}
const endianness = os.endianness();
is.string(endianness);
const hostname = os.hostname();
is.string(hostname);
assert.ok(hostname.length > 0);
if (!common.isIBMi) {
  const uptime = os.uptime();
  is.number(uptime);
  assert.ok(uptime > 0);
}
const cpus = os.cpus();
is.array(cpus);
assert.ok(cpus.length > 0);
for (const cpu of cpus) {
  assert.strictEqual(typeof cpu.model, 'string');
  assert.strictEqual(typeof cpu.speed, 'number');
  assert.strictEqual(typeof cpu.times.user, 'number');
  assert.strictEqual(typeof cpu.times.nice, 'number');
  assert.strictEqual(typeof cpu.times.sys, 'number');
  assert.strictEqual(typeof cpu.times.idle, 'number');
  assert.strictEqual(typeof cpu.times.irq, 'number');
}
const type = os.type();
is.string(type);
assert.ok(type.length > 0);
const release = os.release();
is.string(release);
assert.ok(release.length > 0);
if (common.isAIX)
const platform = os.platform();
is.string(platform);
assert.ok(platform.length > 0);
const arch = os.arch();
is.string(arch);
assert.ok(arch.length > 0);
if (!common.isSunOS) {
  assert.ok(os.loadavg().length > 0);
  assert.ok(os.freemem() > 0);
  assert.ok(os.totalmem() > 0);
}
const interfaces = os.networkInterfaces();
switch (platform) {
  case 'linux': {
    const filter = (e) =>
      e.address === '127.0.0.1' &&
      e.netmask === '255.0.0.0';
    const actual = interfaces.lo.filter(filter);
    const expected = [{
      address: '127.0.0.1',
      netmask: '255.0.0.0',
      family: 'IPv4',
      mac: '00:00:00:00:00:00',
      internal: true,
    }];
    assert.deepStrictEqual(actual, expected);
    break;
  }
  case 'win32': {
    const filter = (e) =>
      e.address === '127.0.0.1';
    const actual = interfaces['Loopback Pseudo-Interface 1'].filter(filter);
    const expected = [{
      address: '127.0.0.1',
      netmask: '255.0.0.0',
      family: 'IPv4',
      mac: '00:00:00:00:00:00',
      internal: true,
    }];
    assert.deepStrictEqual(actual, expected);
    break;
  }
}
const netmaskToCIDRSuffixMap = new Map(Object.entries({
  '255.0.0.0': 8,
  '255.255.255.0': 24,
  'ffff:ffff:ffff:ffff::': 64,
  'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff': 128
}));
Object.values(interfaces)
  .flat(Infinity)
  .map((v) => ({ v, mask: netmaskToCIDRSuffixMap.get(v.netmask) }))
  .forEach(({ v, mask }) => {
    assert.ok('cidr' in v, `"cidr" prop not found in ${inspect(v)}`);
    if (mask) {
    }
  });
const EOL = os.EOL;
if (common.isWindows) {
  assert.strictEqual(EOL, '\r\n');
} else {
  assert.strictEqual(EOL, '\n');
}
const home = os.homedir();
is.string(home);
assert.ok(home.includes(path.sep));
const version = os.version();
assert.strictEqual(typeof version, 'string');
assert(version);
if (common.isWindows && process.env.USERPROFILE) {
  assert.strictEqual(home, process.env.USERPROFILE);
  delete process.env.USERPROFILE;
  assert.ok(os.homedir().includes(path.sep));
  process.env.USERPROFILE = home;
} else if (!common.isWindows && process.env.HOME) {
  assert.strictEqual(home, process.env.HOME);
  delete process.env.HOME;
  assert.ok(os.homedir().includes(path.sep));
  process.env.HOME = home;
}
const pwd = os.userInfo();
is.object(pwd);
const pwdBuf = os.userInfo({ encoding: 'buffer' });
if (common.isWindows) {
  assert.strictEqual(pwd.uid, -1);
  assert.strictEqual(pwd.gid, -1);
  assert.strictEqual(pwd.shell, null);
  assert.strictEqual(pwdBuf.uid, -1);
  assert.strictEqual(pwdBuf.gid, -1);
  assert.strictEqual(pwdBuf.shell, null);
} else {
  is.number(pwd.uid);
  is.number(pwd.gid);
  assert.strictEqual(typeof pwd.shell, 'string');
  if (pwd.shell.length > 0) {
    assert(pwd.shell.includes(path.sep));
  }
  assert.strictEqual(pwd.uid, pwdBuf.uid);
  assert.strictEqual(pwd.gid, pwdBuf.gid);
  assert.strictEqual(pwd.shell, pwdBuf.shell.toString('utf8'));
}
is.string(pwd.username);
assert.ok(pwd.homedir.includes(path.sep));
assert.strictEqual(pwd.username, pwdBuf.username.toString('utf8'));
assert.strictEqual(pwd.homedir, pwdBuf.homedir.toString('utf8'));
assert.strictEqual(`${os.hostname}`, os.hostname());
assert.strictEqual(`${os.homedir}`, os.homedir());
assert.strictEqual(`${os.release}`, os.release());
assert.strictEqual(`${os.type}`, os.type());
assert.strictEqual(`${os.endianness}`, os.endianness());
assert.strictEqual(`${os.tmpdir}`, os.tmpdir());
assert.strictEqual(`${os.arch}`, os.arch());
assert.strictEqual(`${os.platform}`, os.platform());
assert.strictEqual(`${os.version}`, os.version());
assert.strictEqual(+os.totalmem, os.totalmem());
if (!common.isIBMi) {
  is.number(+os.uptime, 'uptime');
  is.number(os.uptime(), 'uptime');
}
is.number(+os.freemem, 'freemem');
is.number(os.freemem(), 'freemem');
const devNull = os.devNull;
if (common.isWindows) {
  assert.strictEqual(devNull, '\\\\.\\nul');
} else {
}
