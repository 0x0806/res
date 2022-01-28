'use strict';
const assert = require('assert');
const path = require('path');
const fs = require('fs');
const { COPYFILE_FICLONE } = fs.constants;
const child_process = require('child_process');
const pkgName = 'foo';
addLibraryPath(process.env);
if (process.argv[2] === 'child') {
  console.log(require(pkgName).string);
} else {
  tmpdir.refresh();
  const prefixPath = path.join(tmpdir.path, 'install');
  fs.mkdirSync(prefixPath);
  let testExecPath;
  if (common.isWindows) {
    testExecPath = path.join(prefixPath, path.basename(process.execPath));
  } else {
    const prefixBinPath = path.join(prefixPath, 'bin');
    fs.mkdirSync(prefixBinPath);
    testExecPath = path.join(prefixBinPath, path.basename(process.execPath));
  }
  const mode = fs.statSync(process.execPath).mode;
  fs.copyFileSync(process.execPath, testExecPath, COPYFILE_FICLONE);
  fs.chmodSync(testExecPath, mode);
  const runTest = (expectedString, env) => {
    const child = child_process.execFileSync(testExecPath,
                                             [ __filename, 'child' ],
                                             { encoding: 'utf8', env: env });
    assert.strictEqual(child.trim(), expectedString);
  };
  const testFixturesDir = fixtures.path(path.basename(__filename, '.js'));
  const env = { ...process.env };
  delete env.NODE_PATH;
  const noPkgHomeDir = path.join(tmpdir.path, 'home-no-pkg');
  fs.mkdirSync(noPkgHomeDir);
  env.HOME = env.USERPROFILE = noPkgHomeDir;
  assert.throws(
    () => {
      child_process.execFileSync(testExecPath, [ __filename, 'child' ],
                                 { encoding: 'utf8', env: env });
    },
    new RegExp(`Cannot find module '${pkgName}'`));
  const modHomeDir = path.join(testFixturesDir, 'home-pkg-in-node_modules');
  env.HOME = env.USERPROFILE = modHomeDir;
  const libHomeDir = path.join(testFixturesDir, 'home-pkg-in-node_libraries');
  env.HOME = env.USERPROFILE = libHomeDir;
  const bothHomeDir = path.join(testFixturesDir, 'home-pkg-in-both');
  env.HOME = env.USERPROFILE = bothHomeDir;
  const prefixLibPath = path.join(prefixPath, 'lib');
  fs.mkdirSync(prefixLibPath);
  const prefixLibNodePath = path.join(prefixLibPath, 'node');
  fs.mkdirSync(prefixLibNodePath);
  const pkgPath = path.join(prefixLibNodePath, `${pkgName}.js`);
  fs.writeFileSync(pkgPath, `exports.string = '${expectedString}';`);
  env.HOME = env.USERPROFILE = noPkgHomeDir;
  runTest(expectedString, env);
  env.HOME = env.USERPROFILE = bothHomeDir;
  env.HOME = env.USERPROFILE = bothHomeDir;
  env.NODE_PATH = path.join(testFixturesDir, 'node_path');
  runTest('$NODE_PATH', env);
  const localDir = path.join(testFixturesDir, 'local-pkg');
  env.HOME = env.USERPROFILE = bothHomeDir;
  env.NODE_PATH = path.join(testFixturesDir, 'node_path');
  const child = child_process.execFileSync(testExecPath,
                                           [ path.join(localDir, 'test.js') ],
                                           { encoding: 'utf8', env: env });
  assert.strictEqual(child.trim(), 'local');
}
