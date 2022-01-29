'use strict';
const assert = require('assert');
const path = require('path');
const fs = require('fs');
const filepath = path.join(tmpdir.path, 'write_pos.txt');
const cb_expected = 'write open close write open close write open close ';
let cb_occurred = '';
const fileDataInitial = 'abcdefghijklmnopqrstuvwxyz';
const fileDataExpected_1 = 'abcdefghijklmnopqrstuvwxyz';
const fileDataExpected_2 = 'abcdefghij123456qrstuvwxyz';
const fileDataExpected_3 = 'abcdefghij\u2026\u2026qrstuvwxyz';
process.on('exit', function() {
  if (cb_occurred !== cb_expected) {
    console.log('  Test callback events missing or out of order:');
    console.log(`    expected: ${cb_expected}`);
    console.log(`    occurred: ${cb_occurred}`);
    assert.strictEqual(
      cb_occurred, cb_expected,
      `events missing or out of order: "${cb_occurred}" !== "${cb_expected}"`);
  }
});
tmpdir.refresh();
function run_test_1() {
  const options = {};
  const file = fs.createWriteStream(filepath, options);
  console.log('    (debug: start         ', file.start);
  console.log('    (debug: pos           ', file.pos);
  file.on('open', function(fd) {
    cb_occurred += 'open ';
  });
  file.on('close', function() {
    cb_occurred += 'close ';
    console.log('    (debug: bytesWritten  ', file.bytesWritten);
    console.log('    (debug: start         ', file.start);
    console.log('    (debug: pos           ', file.pos);
    assert.strictEqual(file.bytesWritten, buffer.length);
    const fileData = fs.readFileSync(filepath, 'utf8');
    console.log('    (debug: file data   ', fileData);
    console.log('    (debug: expected    ', fileDataExpected_1);
    assert.strictEqual(fileData, fileDataExpected_1);
    run_test_2();
  });
  file.on('error', function(err) {
    cb_occurred += 'error ';
    console.log('    (debug: err event ', err);
    throw err;
  });
  const buffer = Buffer.from(fileDataInitial);
  file.write(buffer);
  cb_occurred += 'write ';
  file.end();
}
function run_test_2() {
  const buffer = Buffer.from('123456');
  const options = { start: 10,
                    flags: 'r+' };
  const file = fs.createWriteStream(filepath, options);
  console.log('    (debug: start         ', file.start);
  console.log('    (debug: pos           ', file.pos);
  file.on('open', function(fd) {
    cb_occurred += 'open ';
  });
  file.on('close', function() {
    cb_occurred += 'close ';
    console.log('    (debug: bytesWritten  ', file.bytesWritten);
    console.log('    (debug: start         ', file.start);
    console.log('    (debug: pos           ', file.pos);
    assert.strictEqual(file.bytesWritten, buffer.length);
    const fileData = fs.readFileSync(filepath, 'utf8');
    console.log('    (debug: file data   ', fileData);
    console.log('    (debug: expected    ', fileDataExpected_2);
    assert.strictEqual(fileData, fileDataExpected_2);
    run_test_3();
  });
  file.on('error', function(err) {
    cb_occurred += 'error ';
    console.log('    (debug: err event ', err);
    throw err;
  });
  file.write(buffer);
  cb_occurred += 'write ';
  file.end();
}
function run_test_3() {
  const options = { start: 10,
                    flags: 'r+' };
  const file = fs.createWriteStream(filepath, options);
  console.log('    (debug: start         ', file.start);
  console.log('    (debug: pos           ', file.pos);
  file.on('open', function(fd) {
    cb_occurred += 'open ';
  });
  file.on('close', function() {
    cb_occurred += 'close ';
    console.log('    (debug: bytesWritten  ', file.bytesWritten);
    console.log('    (debug: start         ', file.start);
    console.log('    (debug: pos           ', file.pos);
    assert.strictEqual(file.bytesWritten, data.length * 3);
    const fileData = fs.readFileSync(filepath, 'utf8');
    console.log('    (debug: file data   ', fileData);
    console.log('    (debug: expected    ', fileDataExpected_3);
    assert.strictEqual(fileData, fileDataExpected_3);
    run_test_4();
    run_test_5();
  });
  file.on('error', function(err) {
    cb_occurred += 'error ';
    console.log('    (debug: err event ', err);
    throw err;
  });
  file.write(data, 'utf8');
  cb_occurred += 'write ';
  file.end();
}
const run_test_4 = common.mustCall(function() {
  const fn = () => {
    fs.createWriteStream(filepath, { start: -5, flags: 'r+' });
  };
  const err = {
    code: 'ERR_OUT_OF_RANGE',
    message: 'The value of "start" is out of range. ' +
             `It must be >= 0 && <= ${Number.MAX_SAFE_INTEGER}. Received -5`,
    name: 'RangeError'
  };
  assert.throws(fn, err);
});
const run_test_5 = common.mustCall(function() {
  const fn = () => {
    fs.createWriteStream(filepath, { start: 2 ** 53, flags: 'r+' });
  };
  const err = {
    code: 'ERR_OUT_OF_RANGE',
    message: 'The value of "start" is out of range. It must be ' +
             `>= 0 && <= ${Number.MAX_SAFE_INTEGER}. ` +
             'Received 9_007_199_254_740_992',
    name: 'RangeError'
  };
  assert.throws(fn, err);
});
run_test_1();
