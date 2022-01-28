'use strict';
const assert = require('assert');
const fs = require('fs');
const spawnSync = require('child_process').spawnSync;
if (process.argv[2] === 'child') {
  const list = [];
  while (true) {
    const record = new MyRecord();
    list.push(record);
  }
  function MyRecord() {
    this.name = 'foo';
    this.id = 128;
    this.account = 98454324;
  }
}
const ARGS = [
  '--max-old-space-size=20',
  __filename,
  'child',
];
{
  tmpdir.refresh();
  const args = ['--report-on-fatalerror', ...ARGS];
  const child = spawnSync(process.execPath, args, { cwd: tmpdir.path });
  assert.notStrictEqual(child.status, 0, 'Process exited unexpectedly');
  const reports = helper.findReports(child.pid, tmpdir.path);
  assert.strictEqual(reports.length, 1);
  const report = reports[0];
  helper.validate(report);
  assert.strictEqual(require(report).header.threadId, null);
}
{
  const args = ARGS;
  const child = spawnSync(process.execPath, args, { cwd: tmpdir.path });
  assert.notStrictEqual(child.status, 0, 'Process exited unexpectedly');
  const reports = helper.findReports(child.pid, tmpdir.path);
  assert.strictEqual(reports.length, 0);
}
{
  tmpdir.refresh();
  const dir = '--report-directory=' + tmpdir.path;
  const args = ['--report-on-fatalerror', dir, ...ARGS];
  const child = spawnSync(process.execPath, args, { });
  assert.notStrictEqual(child.status, 0, 'Process exited unexpectedly');
  const reports = helper.findReports(child.pid, tmpdir.path);
  assert.strictEqual(reports.length, 1);
  const report = reports[0];
  helper.validate(report);
  assert.strictEqual(require(report).header.threadId, null);
  const lines = fs.readFileSync(report, 'utf8').split('\n').length - 1;
  assert(lines > 10);
}
{
  tmpdir.refresh();
  const args = ['--report-on-fatalerror', '--report-compact', ...ARGS];
  const child = spawnSync(process.execPath, args, { cwd: tmpdir.path });
  assert.notStrictEqual(child.status, 0, 'Process exited unexpectedly');
  const reports = helper.findReports(child.pid, tmpdir.path);
  assert.strictEqual(reports.length, 1);
  const report = reports[0];
  helper.validate(report);
  assert.strictEqual(require(report).header.threadId, null);
  const lines = fs.readFileSync(report, 'utf8').split('\n').length - 1;
  assert.strictEqual(lines, 1);
}
{
  tmpdir.refresh();
  const args = [
    '--report-on-fatalerror',
    '--report-compact',
    '--report-filename=stderr',
    ...ARGS,
  ];
  const child = spawnSync(process.execPath, args, { encoding: 'utf8' });
  assert.notStrictEqual(child.status, 0, 'Process exited unexpectedly');
  const reports = helper.findReports(child.pid, tmpdir.path);
  assert.strictEqual(reports.length, 0);
  const lines = child.stderr.split('\n');
  const report = lines.find((i) => i.startsWith('{'));
  const json = JSON.parse(report);
  assert.strictEqual(json.header.threadId, null);
}
