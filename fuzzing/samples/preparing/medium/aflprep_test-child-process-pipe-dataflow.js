'use strict';
const assert = require('assert');
const path = require('path');
const fs = require('fs');
const spawn = require('child_process').spawn;
let cat, grep, wc;
const KB = 1024;
const MB = KB * KB;
{
  tmpdir.refresh();
  const file = path.resolve(tmpdir.path, 'data.txt');
  const buf = Buffer.alloc(MB).fill('x');
  for (let i = 1; i < KB; i++)
    buf.write('\n', i * KB);
  fs.writeFileSync(file, buf.toString());
  cat = spawn('cat', [file]);
  grep = spawn('grep', ['x'], { stdio: [cat.stdout, 'pipe', 'pipe'] });
  wc = spawn('wc', ['-c'], { stdio: [grep.stdout, 'pipe', 'pipe'] });
  cat.stdout._handle.readStart = common.mustNotCall();
  grep.stdout._handle.readStart = common.mustNotCall();
  const errors = [];
  process.on('exit', () => {
    assert.deepStrictEqual(errors, []);
  });
  [cat, grep, wc].forEach((child, index) => {
    const errorHandler = (thing, type) => {
      console.error(`unexpected ${type} from child #${index}:\n${thing}`);
    };
    child.stderr.on('data', (d) => { errorHandler(d, 'data'); });
    child.on('error', (err) => { errorHandler(err, 'error'); });
    child.on('exit', common.mustCall((code) => {
      if (code !== 0) {
        errors.push(`child ${index} exited with code ${code}`);
      }
    }));
  });
  let wcBuf = '';
  wc.stdout.on('data', common.mustCall((data) => {
    wcBuf += data;
  }));
  process.on('exit', () => {
    assert.strictEqual(wcBuf.trim(), (MB + 1).toString());
  });
}
