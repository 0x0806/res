'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
tmpdir.refresh();
const nonexistentFile = path.join(tmpdir.path, 'non-existent');
const nonexistentDir = path.join(tmpdir.path, 'non-existent', 'foo', 'bar');
const existingFile = path.join(tmpdir.path, 'existingFile.js');
const existingFile2 = path.join(tmpdir.path, 'existingFile2.js');
const existingDir = path.join(tmpdir.path, 'dir');
const existingDir2 = fixtures.path('keys');
fs.mkdirSync(existingDir);
fs.writeFileSync(existingFile, 'test', 'utf-8');
fs.writeFileSync(existingFile2, 'test', 'utf-8');
const { COPYFILE_EXCL } = fs.constants;
const {
  UV_EBADF,
  UV_EEXIST,
  UV_EINVAL,
  UV_ENOENT,
  UV_ENOTDIR,
  UV_ENOTEMPTY,
  UV_EPERM
} = internalBinding('uv');
function re(literals, ...values) {
  let result = literals[0].replace(escapeRE, '\\$&');
  for (const [i, value] of values.entries()) {
    result += value.replace(escapeRE, '\\$&');
    result += literals[i + 1].replace(escapeRE, '\\$&');
  }
  return result;
}
{
  const validateError = (err) => {
    assert.strictEqual(nonexistentFile, err.path);
    assert.strictEqual(
      err.message,
      `ENOENT: no such file or directory, stat '${nonexistentFile}'`);
    assert.strictEqual(err.errno, UV_ENOENT);
    assert.strictEqual(err.code, 'ENOENT');
    assert.strictEqual(err.syscall, 'stat');
    return true;
  };
  fs.stat(nonexistentFile, common.mustCall(validateError));
  assert.throws(
    () => fs.statSync(nonexistentFile),
    validateError
  );
}
{
  const validateError = (err) => {
    assert.strictEqual(nonexistentFile, err.path);
    assert.strictEqual(
      err.message,
      `ENOENT: no such file or directory, lstat '${nonexistentFile}'`);
    assert.strictEqual(err.errno, UV_ENOENT);
    assert.strictEqual(err.code, 'ENOENT');
    assert.strictEqual(err.syscall, 'lstat');
    return true;
  };
  fs.lstat(nonexistentFile, common.mustCall(validateError));
  assert.throws(
    () => fs.lstatSync(nonexistentFile),
    validateError
  );
}
{
  const validateError = (err) => {
    assert.strictEqual(err.message, 'EBADF: bad file descriptor, fstat');
    assert.strictEqual(err.errno, UV_EBADF);
    assert.strictEqual(err.code, 'EBADF');
    assert.strictEqual(err.syscall, 'fstat');
    return true;
  };
  common.runWithInvalidFD((fd) => {
    fs.fstat(fd, common.mustCall(validateError));
    assert.throws(
      () => fs.fstatSync(fd),
      validateError
    );
  });
}
{
  const validateError = (err) => {
    assert.strictEqual(nonexistentFile, err.path);
    assert.strictEqual(
      err.message,
      `ENOENT: no such file or directory, lstat '${nonexistentFile}'`);
    assert.strictEqual(err.errno, UV_ENOENT);
    assert.strictEqual(err.code, 'ENOENT');
    assert.strictEqual(err.syscall, 'lstat');
    return true;
  };
  fs.realpath(nonexistentFile, common.mustCall(validateError));
  assert.throws(
    () => fs.realpathSync(nonexistentFile),
    validateError
  );
}
{
  const validateError = (err) => {
    assert.strictEqual(nonexistentFile, err.path);
    assert.strictEqual(
      err.message,
      `ENOENT: no such file or directory, realpath '${nonexistentFile}'`);
    assert.strictEqual(err.errno, UV_ENOENT);
    assert.strictEqual(err.code, 'ENOENT');
    assert.strictEqual(err.syscall, 'realpath');
    return true;
  };
  fs.realpath.native(nonexistentFile, common.mustCall(validateError));
  assert.throws(
    () => fs.realpathSync.native(nonexistentFile),
    validateError
  );
}
{
  const validateError = (err) => {
    assert.strictEqual(nonexistentFile, err.path);
    assert.strictEqual(
      err.message,
      `ENOENT: no such file or directory, readlink '${nonexistentFile}'`);
    assert.strictEqual(err.errno, UV_ENOENT);
    assert.strictEqual(err.code, 'ENOENT');
    assert.strictEqual(err.syscall, 'readlink');
    return true;
  };
  fs.readlink(nonexistentFile, common.mustCall(validateError));
  assert.throws(
    () => fs.readlinkSync(nonexistentFile),
    validateError
  );
}
{
  const validateError = (err) => {
    assert.strictEqual(nonexistentFile, err.path);
    assert.ok(err.dest.endsWith('foo'),
              `expect ${err.dest} to end with 'foo'`);
    const regexp = new RegExp('^ENOENT: no such file or directory, link ' +
                              re`'${nonexistentFile}' -> ` + '\'.*foo\'');
    assert.match(err.message, regexp);
    assert.strictEqual(err.errno, UV_ENOENT);
    assert.strictEqual(err.code, 'ENOENT');
    assert.strictEqual(err.syscall, 'link');
    return true;
  };
  fs.link(nonexistentFile, 'foo', common.mustCall(validateError));
  assert.throws(
    () => fs.linkSync(nonexistentFile, 'foo'),
    validateError
  );
}
{
  const validateError = (err) => {
    assert.strictEqual(existingFile, err.path);
    assert.strictEqual(existingFile2, err.dest);
    assert.strictEqual(
      err.message,
      `EEXIST: file already exists, link '${existingFile}' -> ` +
      `'${existingFile2}'`);
    assert.strictEqual(err.errno, UV_EEXIST);
    assert.strictEqual(err.code, 'EEXIST');
    assert.strictEqual(err.syscall, 'link');
    return true;
  };
  fs.link(existingFile, existingFile2, common.mustCall(validateError));
  assert.throws(
    () => fs.linkSync(existingFile, existingFile2),
    validateError
  );
}
{
  const validateError = (err) => {
    assert.strictEqual(existingFile, err.path);
    assert.strictEqual(existingFile2, err.dest);
    assert.strictEqual(
      err.message,
      `EEXIST: file already exists, symlink '${existingFile}' -> ` +
      `'${existingFile2}'`);
    assert.strictEqual(err.errno, UV_EEXIST);
    assert.strictEqual(err.code, 'EEXIST');
    assert.strictEqual(err.syscall, 'symlink');
    return true;
  };
  fs.symlink(existingFile, existingFile2, common.mustCall(validateError));
  assert.throws(
    () => fs.symlinkSync(existingFile, existingFile2),
    validateError
  );
}
{
  const validateError = (err) => {
    assert.strictEqual(nonexistentFile, err.path);
    assert.strictEqual(
      err.message,
      `ENOENT: no such file or directory, unlink '${nonexistentFile}'`);
    assert.strictEqual(err.errno, UV_ENOENT);
    assert.strictEqual(err.code, 'ENOENT');
    assert.strictEqual(err.syscall, 'unlink');
    return true;
  };
  fs.unlink(nonexistentFile, common.mustCall(validateError));
  assert.throws(
    () => fs.unlinkSync(nonexistentFile),
    validateError
  );
}
{
  const validateError = (err) => {
    assert.strictEqual(nonexistentFile, err.path);
    assert.ok(err.dest.endsWith('foo'),
              `expect ${err.dest} to end with 'foo'`);
    const regexp = new RegExp('ENOENT: no such file or directory, rename ' +
                              re`'${nonexistentFile}' -> ` + '\'.*foo\'');
    assert.match(err.message, regexp);
    assert.strictEqual(err.errno, UV_ENOENT);
    assert.strictEqual(err.code, 'ENOENT');
    assert.strictEqual(err.syscall, 'rename');
    return true;
  };
  const destFile = path.join(tmpdir.path, 'foo');
  fs.rename(nonexistentFile, destFile, common.mustCall(validateError));
  assert.throws(
    () => fs.renameSync(nonexistentFile, destFile),
    validateError
  );
}
{
  const validateError = (err) => {
    assert.strictEqual(existingDir, err.path);
    assert.strictEqual(existingDir2, err.dest);
    assert.strictEqual(err.syscall, 'rename');
    if (err.code === 'ENOTEMPTY') {
      assert.strictEqual(
        err.message,
        `ENOTEMPTY: directory not empty, rename '${existingDir}' -> ` +
        `'${existingDir2}'`);
      assert.strictEqual(err.errno, UV_ENOTEMPTY);
      assert.strictEqual(
        err.message,
        `EXDEV: cross-device link not permitted, rename '${existingDir}' -> ` +
            `'${existingDir2}'`);
      assert.strictEqual(
        err.message,
        `EEXIST: file already exists, rename '${existingDir}' -> ` +
        `'${existingDir2}'`);
      assert.strictEqual(err.errno, UV_EEXIST);
      assert.strictEqual(
        err.message,
        `EPERM: operation not permitted, rename '${existingDir}' -> ` +
        `'${existingDir2}'`);
      assert.strictEqual(err.errno, UV_EPERM);
      assert.strictEqual(err.code, 'EPERM');
    }
    return true;
  };
  fs.rename(existingDir, existingDir2, common.mustCall(validateError));
  assert.throws(
    () => fs.renameSync(existingDir, existingDir2),
    validateError
  );
}
{
  const validateError = (err) => {
    assert.strictEqual(nonexistentFile, err.path);
    assert.strictEqual(
      err.message,
      `ENOENT: no such file or directory, rmdir '${nonexistentFile}'`);
    assert.strictEqual(err.errno, UV_ENOENT);
    assert.strictEqual(err.code, 'ENOENT');
    assert.strictEqual(err.syscall, 'rmdir');
    return true;
  };
  fs.rmdir(nonexistentFile, common.mustCall(validateError));
  assert.throws(
    () => fs.rmdirSync(nonexistentFile),
    validateError
  );
}
{
  const validateError = (err) => {
    assert.strictEqual(existingFile, err.path);
    assert.strictEqual(err.syscall, 'rmdir');
    if (err.code === 'ENOTDIR') {
      assert.strictEqual(
        err.message,
        `ENOTDIR: not a directory, rmdir '${existingFile}'`);
      assert.strictEqual(err.errno, UV_ENOTDIR);
      assert.strictEqual(
        err.message,
        `ENOENT: no such file or directory, rmdir '${existingFile}'`);
      assert.strictEqual(err.errno, UV_ENOENT);
      assert.strictEqual(err.code, 'ENOENT');
    }
    return true;
  };
  fs.rmdir(existingFile, common.mustCall(validateError));
  assert.throws(
    () => fs.rmdirSync(existingFile),
    validateError
  );
}
{
  const validateError = (err) => {
    assert.strictEqual(existingFile, err.path);
    assert.strictEqual(
      err.message,
      `EEXIST: file already exists, mkdir '${existingFile}'`);
    assert.strictEqual(err.errno, UV_EEXIST);
    assert.strictEqual(err.code, 'EEXIST');
    assert.strictEqual(err.syscall, 'mkdir');
    return true;
  };
  fs.mkdir(existingFile, 0o666, common.mustCall(validateError));
  assert.throws(
    () => fs.mkdirSync(existingFile, 0o666),
    validateError
  );
}
{
  const validateError = (err) => {
    assert.strictEqual(nonexistentFile, err.path);
    assert.strictEqual(
      err.message,
      `ENOENT: no such file or directory, chmod '${nonexistentFile}'`);
    assert.strictEqual(err.errno, UV_ENOENT);
    assert.strictEqual(err.code, 'ENOENT');
    assert.strictEqual(err.syscall, 'chmod');
    return true;
  };
  fs.chmod(nonexistentFile, 0o666, common.mustCall(validateError));
  assert.throws(
    () => fs.chmodSync(nonexistentFile, 0o666),
    validateError
  );
}
{
  const validateError = (err) => {
    assert.strictEqual(nonexistentFile, err.path);
    assert.strictEqual(
      err.message,
      `ENOENT: no such file or directory, open '${nonexistentFile}'`);
    assert.strictEqual(err.errno, UV_ENOENT);
    assert.strictEqual(err.code, 'ENOENT');
    assert.strictEqual(err.syscall, 'open');
    return true;
  };
  fs.open(nonexistentFile, 'r', 0o666, common.mustCall(validateError));
  assert.throws(
    () => fs.openSync(nonexistentFile, 'r', 0o666),
    validateError
  );
}
{
  const validateError = (err) => {
    assert.strictEqual(err.message, 'EBADF: bad file descriptor, close');
    assert.strictEqual(err.errno, UV_EBADF);
    assert.strictEqual(err.code, 'EBADF');
    assert.strictEqual(err.syscall, 'close');
    return true;
  };
  common.runWithInvalidFD((fd) => {
    fs.close(fd, common.mustCall(validateError));
    assert.throws(
      () => fs.closeSync(fd),
      validateError
    );
  });
}
{
  const validateError = (err) => {
    assert.strictEqual(nonexistentFile, err.path);
    assert.strictEqual(
      err.message,
      `ENOENT: no such file or directory, open '${nonexistentFile}'`);
    assert.strictEqual(err.errno, UV_ENOENT);
    assert.strictEqual(err.code, 'ENOENT');
    assert.strictEqual(err.syscall, 'open');
    return true;
  };
  fs.readFile(nonexistentFile, common.mustCall(validateError));
  assert.throws(
    () => fs.readFileSync(nonexistentFile),
    validateError
  );
}
{
  const validateError = (err) => {
    assert.strictEqual(nonexistentFile, err.path);
    assert.strictEqual(
      err.message,
      `ENOENT: no such file or directory, scandir '${nonexistentFile}'`);
    assert.strictEqual(err.errno, UV_ENOENT);
    assert.strictEqual(err.code, 'ENOENT');
    assert.strictEqual(err.syscall, 'scandir');
    return true;
  };
  fs.readdir(nonexistentFile, common.mustCall(validateError));
  assert.throws(
    () => fs.readdirSync(nonexistentFile),
    validateError
  );
}
{
  const validateError = (err) => {
    assert.strictEqual(err.syscall, 'ftruncate');
    if (err.code === 'EBADF') {
      assert.strictEqual(err.message, 'EBADF: bad file descriptor, ftruncate');
      assert.strictEqual(err.errno, UV_EBADF);
    } else {
      assert.strictEqual(err.message, 'EINVAL: invalid argument, ftruncate');
      assert.strictEqual(err.errno, UV_EINVAL);
      assert.strictEqual(err.code, 'EINVAL');
    }
    return true;
  };
  common.runWithInvalidFD((fd) => {
    fs.ftruncate(fd, 4, common.mustCall(validateError));
    assert.throws(
      () => fs.ftruncateSync(fd, 4),
      validateError
    );
  });
}
{
  const validateError = (err) => {
    assert.strictEqual(err.message, 'EBADF: bad file descriptor, fdatasync');
    assert.strictEqual(err.errno, UV_EBADF);
    assert.strictEqual(err.code, 'EBADF');
    assert.strictEqual(err.syscall, 'fdatasync');
    return true;
  };
  common.runWithInvalidFD((fd) => {
    fs.fdatasync(fd, common.mustCall(validateError));
    assert.throws(
      () => fs.fdatasyncSync(fd),
      validateError
    );
  });
}
{
  const validateError = (err) => {
    assert.strictEqual(err.message, 'EBADF: bad file descriptor, fsync');
    assert.strictEqual(err.errno, UV_EBADF);
    assert.strictEqual(err.code, 'EBADF');
    assert.strictEqual(err.syscall, 'fsync');
    return true;
  };
  common.runWithInvalidFD((fd) => {
    fs.fsync(fd, common.mustCall(validateError));
    assert.throws(
      () => fs.fsyncSync(fd),
      validateError
    );
  });
}
if (!common.isWindows) {
  const validateError = (err) => {
    assert.strictEqual(nonexistentFile, err.path);
    assert.strictEqual(
      err.message,
      `ENOENT: no such file or directory, chown '${nonexistentFile}'`);
    assert.strictEqual(err.errno, UV_ENOENT);
    assert.strictEqual(err.code, 'ENOENT');
    assert.strictEqual(err.syscall, 'chown');
    return true;
  };
  fs.chown(nonexistentFile, process.getuid(), process.getgid(),
           common.mustCall(validateError));
  assert.throws(
    () => fs.chownSync(nonexistentFile,
                       process.getuid(), process.getgid()),
    validateError
  );
}
if (!common.isAIX) {
  const validateError = (err) => {
    assert.strictEqual(nonexistentFile, err.path);
    assert.strictEqual(
      err.message,
      `ENOENT: no such file or directory, utime '${nonexistentFile}'`);
    assert.strictEqual(err.errno, UV_ENOENT);
    assert.strictEqual(err.code, 'ENOENT');
    assert.strictEqual(err.syscall, 'utime');
    return true;
  };
  fs.utimes(nonexistentFile, new Date(), new Date(),
            common.mustCall(validateError));
  assert.throws(
    () => fs.utimesSync(nonexistentFile, new Date(), new Date()),
    validateError
  );
}
{
  const validateError = (err) => {
    const pathPrefix = new RegExp('^' + re`${nonexistentDir}`);
    assert.match(err.path, pathPrefix);
    const prefix = new RegExp('^ENOENT: no such file or directory, mkdtemp ' +
                              re`'${nonexistentDir}`);
    assert.match(err.message, prefix);
    assert.strictEqual(err.errno, UV_ENOENT);
    assert.strictEqual(err.code, 'ENOENT');
    assert.strictEqual(err.syscall, 'mkdtemp');
    return true;
  };
  fs.mkdtemp(nonexistentDir, common.mustCall(validateError));
  assert.throws(
    () => fs.mkdtempSync(nonexistentDir),
    validateError
  );
}
{
  const validateError = {
    code: 'ERR_OUT_OF_RANGE'
  };
  assert.throws(
    () => fs.copyFile(existingFile, nonexistentFile, -1, () => {}),
    validateError
  );
  assert.throws(
    () => fs.copyFileSync(existingFile, nonexistentFile, -1),
    validateError
  );
}
{
  const validateError = (err) => {
      assert.strictEqual(err.message,
                         'ENOENT: no such file or directory, copyfile ' +
                         `'${existingFile}' -> '${existingFile2}'`);
      assert.strictEqual(err.errno, UV_ENOENT);
      assert.strictEqual(err.code, 'ENOENT');
      assert.strictEqual(err.syscall, 'copyfile');
    } else {
      assert.strictEqual(err.message,
                         'EEXIST: file already exists, copyfile ' +
                         `'${existingFile}' -> '${existingFile2}'`);
      assert.strictEqual(err.errno, UV_EEXIST);
      assert.strictEqual(err.code, 'EEXIST');
      assert.strictEqual(err.syscall, 'copyfile');
    }
    return true;
  };
  fs.copyFile(existingFile, existingFile2, COPYFILE_EXCL,
              common.mustCall(validateError));
  assert.throws(
    () => fs.copyFileSync(existingFile, existingFile2, COPYFILE_EXCL),
    validateError
  );
}
{
  const validateError = (err) => {
    assert.strictEqual(err.message,
                       'ENOENT: no such file or directory, copyfile ' +
                       `'${nonexistentFile}' -> '${existingFile2}'`);
    assert.strictEqual(err.errno, UV_ENOENT);
    assert.strictEqual(err.code, 'ENOENT');
    assert.strictEqual(err.syscall, 'copyfile');
    return true;
  };
  fs.copyFile(nonexistentFile, existingFile2, COPYFILE_EXCL,
              common.mustCall(validateError));
  assert.throws(
    () => fs.copyFileSync(nonexistentFile, existingFile2, COPYFILE_EXCL),
    validateError
  );
}
{
  const validateError = (err) => {
    assert.strictEqual(err.message, 'EBADF: bad file descriptor, read');
    assert.strictEqual(err.errno, UV_EBADF);
    assert.strictEqual(err.code, 'EBADF');
    assert.strictEqual(err.syscall, 'read');
    return true;
  };
  common.runWithInvalidFD((fd) => {
    const buf = Buffer.alloc(5);
    fs.read(fd, buf, 0, 1, 1, common.mustCall(validateError));
    assert.throws(
      () => fs.readSync(fd, buf, 0, 1, 1),
      validateError
    );
  });
}
{
  const validateError = (err) => {
    assert.strictEqual(err.message, 'EBADF: bad file descriptor, fchmod');
    assert.strictEqual(err.errno, UV_EBADF);
    assert.strictEqual(err.code, 'EBADF');
    assert.strictEqual(err.syscall, 'fchmod');
    return true;
  };
  common.runWithInvalidFD((fd) => {
    fs.fchmod(fd, 0o666, common.mustCall(validateError));
    assert.throws(
      () => fs.fchmodSync(fd, 0o666),
      validateError
    );
  });
}
if (!common.isWindows) {
  const validateError = (err) => {
    assert.strictEqual(err.message, 'EBADF: bad file descriptor, fchown');
    assert.strictEqual(err.errno, UV_EBADF);
    assert.strictEqual(err.code, 'EBADF');
    assert.strictEqual(err.syscall, 'fchown');
    return true;
  };
  common.runWithInvalidFD((fd) => {
    fs.fchown(fd, process.getuid(), process.getgid(),
              common.mustCall(validateError));
    assert.throws(
      () => fs.fchownSync(fd, process.getuid(), process.getgid()),
      validateError
    );
  });
}
{
  const validateError = (err) => {
    assert.strictEqual(err.message, 'EBADF: bad file descriptor, write');
    assert.strictEqual(err.errno, UV_EBADF);
    assert.strictEqual(err.code, 'EBADF');
    assert.strictEqual(err.syscall, 'write');
    return true;
  };
  common.runWithInvalidFD((fd) => {
    const buf = Buffer.alloc(5);
    fs.write(fd, buf, 0, 1, 1, common.mustCall(validateError));
    assert.throws(
      () => fs.writeSync(fd, buf, 0, 1, 1),
      validateError
    );
  });
}
{
  const validateError = (err) => {
    assert.strictEqual(err.message, 'EBADF: bad file descriptor, write');
    assert.strictEqual(err.errno, UV_EBADF);
    assert.strictEqual(err.code, 'EBADF');
    assert.strictEqual(err.syscall, 'write');
    return true;
  };
  common.runWithInvalidFD((fd) => {
    fs.write(fd, 'test', 1, common.mustCall(validateError));
    assert.throws(
      () => fs.writeSync(fd, 'test', 1),
      validateError
    );
  });
}
if (!common.isAIX) {
  const validateError = (err) => {
    assert.strictEqual(err.message, 'EBADF: bad file descriptor, futime');
    assert.strictEqual(err.errno, UV_EBADF);
    assert.strictEqual(err.code, 'EBADF');
    assert.strictEqual(err.syscall, 'futime');
    return true;
  };
  common.runWithInvalidFD((fd) => {
    fs.futimes(fd, new Date(), new Date(), common.mustCall(validateError));
    assert.throws(
      () => fs.futimesSync(fd, new Date(), new Date()),
      validateError
    );
  });
}
