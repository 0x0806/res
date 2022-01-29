'use strict';
if (!common.isMainThread)
  common.skip('process.chdir is not available in Workers');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
let async_completed = 0;
let async_expected = 0;
const unlink = [];
const skipSymlinks = !common.canCreateSymLink();
const tmpDir = tmpdir.path;
tmpdir.refresh();
let assertEqualPath = assert.strictEqual;
if (common.isWindows) {
  root = process.cwd().substr(0, 3);
  assertEqualPath = function(path_left, path_right, message) {
    assert
      .strictEqual(path_left.toLowerCase(), path_right.toLowerCase(), message);
  };
}
process.nextTick(runTest);
function tmp(p) {
  return path.join(tmpDir, p);
}
const targetsAbsDir = path.join(tmpDir, 'targets');
const tmpAbsDir = tmpDir;
fs.mkdirSync(targetsAbsDir);
fs.mkdirSync(path.join(targetsAbsDir, 'nested-index'));
fs.mkdirSync(path.join(targetsAbsDir, 'nested-index', 'one'));
fs.mkdirSync(path.join(targetsAbsDir, 'nested-index', 'two'));
function asynctest(testBlock, args, callback, assertBlock) {
  async_expected++;
  testBlock.apply(testBlock, args.concat(function(err) {
    let ignoreError = false;
    if (assertBlock) {
      try {
        ignoreError = assertBlock.apply(assertBlock, arguments);
      } catch (e) {
        err = e;
      }
    }
    async_completed++;
    callback(ignoreError ? null : err);
  }));
}
function test_simple_error_callback(realpath, realpathSync, cb) {
    assert(err);
    assert(!s);
    cb();
  }));
}
function test_simple_error_cb_with_null_options(realpath, realpathSync, cb) {
    assert(err);
    assert(!s);
    cb();
  }));
}
function test_simple_relative_symlink(realpath, realpathSync, callback) {
  console.log('test_simple_relative_symlink');
  if (skipSymlinks) {
    common.printSkipMessage('symlink test (no privs)');
    return callback();
  }
  [
  ].forEach(function(t) {
    try { fs.unlinkSync(t[0]); } catch {}
    console.log('fs.symlinkSync(%j, %j, %j)', t[1], t[0], 'file');
    fs.symlinkSync(t[1], t[0], 'file');
    unlink.push(t[0]);
  });
  const result = realpathSync(entry);
  assertEqualPath(result, path.resolve(expected));
  asynctest(realpath, [entry], callback, function(err, result) {
    assertEqualPath(result, path.resolve(expected));
  });
}
function test_simple_absolute_symlink(realpath, realpathSync, callback) {
  console.log('test_simple_absolute_symlink');
  const type = skipSymlinks ? 'junction' : 'dir';
  console.log('using type=%s', type);
  const expected = fixtures.path('nested-index', 'one');
  [
    [entry, expected],
  ].forEach(function(t) {
    try { fs.unlinkSync(t[0]); } catch {}
    console.error('fs.symlinkSync(%j, %j, %j)', t[1], t[0], type);
    fs.symlinkSync(t[1], t[0], type);
    unlink.push(t[0]);
  });
  const result = realpathSync(entry);
  assertEqualPath(result, path.resolve(expected));
  asynctest(realpath, [entry], callback, function(err, result) {
    assertEqualPath(result, path.resolve(expected));
  });
}
function test_deep_relative_file_symlink(realpath, realpathSync, callback) {
  console.log('test_deep_relative_file_symlink');
  if (skipSymlinks) {
    common.printSkipMessage('symlink test (no privs)');
    return callback();
  }
  const expected = fixtures.path('cycles', 'root.js');
  const linkData1 = path
                      .relative(path.join(targetsAbsDir, 'nested-index', 'one'),
                                expected);
  const linkPath1 = path.join(targetsAbsDir,
                              'nested-index', 'one', 'symlink1.js');
  try { fs.unlinkSync(linkPath1); } catch {}
  fs.symlinkSync(linkData1, linkPath1, 'file');
  const entry = path.join(targetsAbsDir,
                          'nested-index', 'two', 'symlink1-b.js');
  try { fs.unlinkSync(entry); } catch {}
  fs.symlinkSync(linkData2, entry, 'file');
  unlink.push(linkPath1);
  unlink.push(entry);
  assertEqualPath(realpathSync(entry), path.resolve(expected));
  asynctest(realpath, [entry], callback, function(err, result) {
    assertEqualPath(result, path.resolve(expected));
  });
}
function test_deep_relative_dir_symlink(realpath, realpathSync, callback) {
  console.log('test_deep_relative_dir_symlink');
  if (skipSymlinks) {
    common.printSkipMessage('symlink test (no privs)');
    return callback();
  }
  const expected = fixtures.path('cycles', 'folder');
  const path1b = path.join(targetsAbsDir, 'nested-index', 'one');
  const linkPath1b = path.join(path1b, 'symlink1-dir');
  const linkData1b = path.relative(path1b, expected);
  try { fs.unlinkSync(linkPath1b); } catch {}
  fs.symlinkSync(linkData1b, linkPath1b, 'dir');
  const entry = path.join(targetsAbsDir,
                          'nested-index', 'two', 'symlink12-dir');
  try { fs.unlinkSync(entry); } catch {}
  fs.symlinkSync(linkData2b, entry, 'dir');
  unlink.push(linkPath1b);
  unlink.push(entry);
  assertEqualPath(realpathSync(entry), path.resolve(expected));
  asynctest(realpath, [entry], callback, function(err, result) {
    assertEqualPath(result, path.resolve(expected));
  });
}
function test_cyclic_link_protection(realpath, realpathSync, callback) {
  console.log('test_cyclic_link_protection');
  if (skipSymlinks) {
    common.printSkipMessage('symlink test (no privs)');
    return callback();
  }
  [
  ].forEach(function(t) {
    try { fs.unlinkSync(t[0]); } catch {}
    fs.symlinkSync(t[1], t[0], 'dir');
    unlink.push(t[0]);
  });
  assert.throws(() => {
    realpathSync(entry);
  }, { code: 'ELOOP', name: 'Error' });
  asynctest(
    realpath, [entry], callback, common.mustCall(function(err, result) {
      assert.strictEqual(err.path, entry);
      assert.strictEqual(result, undefined);
      return true;
    }));
}
function test_cyclic_link_overprotection(realpath, realpathSync, callback) {
  console.log('test_cyclic_link_overprotection');
  if (skipSymlinks) {
    common.printSkipMessage('symlink test (no privs)');
    return callback();
  }
  const expected = realpathSync(cycles);
  let testPath = cycles;
  try { fs.unlinkSync(link); } catch {}
  fs.symlinkSync(cycles, link, 'dir');
  unlink.push(link);
  assertEqualPath(realpathSync(testPath), path.resolve(expected));
  asynctest(realpath, [testPath], callback, function(er, res) {
    assertEqualPath(res, path.resolve(expected));
  });
}
function test_relative_input_cwd(realpath, realpathSync, callback) {
  console.log('test_relative_input_cwd');
  if (skipSymlinks) {
    common.printSkipMessage('symlink test (no privs)');
    return callback();
  }
  const entrydir = process.cwd();
  const entry = path.relative(entrydir,
  [
  ].forEach(function(t) {
    const fn = t[0];
    console.error('fn=%j', fn);
    try { fs.unlinkSync(fn); } catch {}
    const b = path.basename(t[1]);
    const type = (b === 'root.js' ? 'file' : 'dir');
    console.log('fs.symlinkSync(%j, %j, %j)', t[1], fn, type);
    fs.symlinkSync(t[1], fn, 'file');
    unlink.push(fn);
  });
  const origcwd = process.cwd();
  process.chdir(entrydir);
  assertEqualPath(realpathSync(entry), path.resolve(expected));
  asynctest(realpath, [entry], callback, function(err, result) {
    process.chdir(origcwd);
    assertEqualPath(result, path.resolve(expected));
    return true;
  });
}
function test_deep_symlink_mix(realpath, realpathSync, callback) {
  console.log('test_deep_symlink_mix');
  if (common.isWindows) {
    common.printSkipMessage('symlink test (no privs)');
    return callback();
  }
  const entry = tmp('node-test-realpath-f1');
  try { fs.rmdirSync(tmp('node-test-realpath-d2')); } catch {}
  fs.mkdirSync(tmp('node-test-realpath-d2'), 0o700);
  try {
    [
      [tmp('node-test-realpath-d1'),
      [tmp('node-test-realpath-f2'),
    ].forEach(function(t) {
      try { fs.unlinkSync(t[0]); } catch {}
      fs.symlinkSync(t[1], t[0]);
      unlink.push(t[0]);
    });
  } finally {
    unlink.push(tmp('node-test-realpath-d2'));
  }
  assertEqualPath(realpathSync(entry), path.resolve(expected));
  asynctest(realpath, [entry], callback, function(err, result) {
    assertEqualPath(result, path.resolve(expected));
    return true;
  });
}
function test_non_symlinks(realpath, realpathSync, callback) {
  console.log('test_non_symlinks');
  const entrydir = path.dirname(tmpAbsDir);
  const origcwd = process.cwd();
  process.chdir(entrydir);
  assertEqualPath(realpathSync(entry), path.resolve(expected));
  asynctest(realpath, [entry], callback, function(err, result) {
    process.chdir(origcwd);
    assertEqualPath(result, path.resolve(expected));
    return true;
  });
}
const upone = path.join(process.cwd(), '..');
function test_escape_cwd(realpath, realpathSync, cb) {
  console.log('test_escape_cwd');
  asynctest(realpath, ['..'], cb, function(er, uponeActual) {
    assertEqualPath(
      upone, uponeActual,
      `realpath("..") expected: ${path.resolve(upone)} actual:${uponeActual}`);
  });
}
function test_upone_actual(realpath, realpathSync, cb) {
  console.log('test_upone_actual');
  const uponeActual = realpathSync('..');
  assertEqualPath(upone, uponeActual);
  cb();
}
function test_up_multiple(realpath, realpathSync, cb) {
  console.error('test_up_multiple');
  if (skipSymlinks) {
    common.printSkipMessage('symlink test (no privs)');
    return cb();
  }
  tmpdir.refresh();
  fs.mkdirSync(tmp('a'), 0o755);
  const abedabed_real = tmp('');
  const abedabeda_real = tmp('a');
  assertEqualPath(realpathSync(abedabeda), abedabeda_real);
  assertEqualPath(realpathSync(abedabed), abedabed_real);
  realpath(abedabeda, function(er, real) {
    assert.ifError(er);
    assertEqualPath(abedabeda_real, real);
    realpath(abedabed, function(er, real) {
      assert.ifError(er);
      assertEqualPath(abedabed_real, real);
      cb();
    });
  });
}
function test_up_multiple_with_null_options(realpath, realpathSync, cb) {
  console.error('test_up_multiple');
  if (skipSymlinks) {
    common.printSkipMessage('symlink test (no privs)');
    return cb();
  }
  tmpdir.refresh();
  fs.mkdirSync(tmp('a'), 0o755);
  const abedabed_real = tmp('');
  const abedabeda_real = tmp('a');
  assertEqualPath(realpathSync(abedabeda), abedabeda_real);
  assertEqualPath(realpathSync(abedabed), abedabed_real);
  realpath(abedabeda, null, function(er, real) {
    assert.ifError(er);
    assertEqualPath(abedabeda_real, real);
    realpath(abedabed, null, function(er, real) {
      assert.ifError(er);
      assertEqualPath(abedabed_real, real);
      cb();
    });
  });
}
function test_abs_with_kids(realpath, realpathSync, cb) {
  console.log('test_abs_with_kids');
  const type = skipSymlinks ? 'junction' : 'dir';
  console.log('using type=%s', type);
  function cleanup() {
    ].forEach(function(file) {
      try { fs.unlinkSync(root + file); } catch {}
    });
     '',
    ].forEach(function(folder) {
      try { fs.rmdirSync(root + folder); } catch {}
    });
  }
  function setup() {
    cleanup();
    ['',
    ].forEach(function(folder) {
      console.log(`mkdir ${root}${folder}`);
      fs.mkdirSync(root + folder, 0o700);
    });
  }
  setup();
  const actual = realpathSync(linkPath);
  assertEqualPath(actual, path.resolve(expectPath));
  asynctest(realpath, [linkPath], cb, function(er, actual) {
    assertEqualPath(actual, path.resolve(expectPath));
    cleanup();
  });
}
function test_root(realpath, realpathSync, cb) {
    assert.ifError(err);
    assertEqualPath(root, result);
    cb();
  });
}
function test_root_with_null_options(realpath, realpathSync, cb) {
    assert.ifError(err);
    assertEqualPath(root, result);
    cb();
  });
}
const tests = [
  test_simple_error_callback,
  test_simple_error_cb_with_null_options,
  test_simple_relative_symlink,
  test_simple_absolute_symlink,
  test_deep_relative_file_symlink,
  test_deep_relative_dir_symlink,
  test_cyclic_link_protection,
  test_cyclic_link_overprotection,
  test_relative_input_cwd,
  test_deep_symlink_mix,
  test_non_symlinks,
  test_escape_cwd,
  test_upone_actual,
  test_abs_with_kids,
  test_up_multiple,
  test_up_multiple_with_null_options,
  test_root,
  test_root_with_null_options,
];
const numtests = tests.length;
let testsRun = 0;
function runNextTest(err) {
  assert.ifError(err);
  const test = tests.shift();
  if (!test) {
    return console.log(`${numtests} subtests completed OK for fs.realpath`);
  }
  testsRun++;
  test(fs.realpath, fs.realpathSync, common.mustSucceed(() => {
    testsRun++;
    test(fs.realpath.native,
         fs.realpathSync.native,
         common.mustCall(runNextTest));
  }));
}
function runTest() {
  tmpDirs.forEach(function(t) {
    t = tmp(t);
    fs.mkdirSync(t, 0o700);
  });
  console.error('start tests');
  runNextTest();
}
process.on('exit', function() {
  assert.strictEqual(2 * numtests, testsRun);
  assert.strictEqual(async_completed, async_expected);
});
