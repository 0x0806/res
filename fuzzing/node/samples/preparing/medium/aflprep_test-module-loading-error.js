'use strict';
const assert = require('assert');
const { execSync } = require('child_process');
const errorMessagesByPlatform = {
  win32: ['is not a valid Win32 application'],
  linux: ['file too short', 'Exec format error'],
  sunos: ['unknown file type', 'not an ELF file'],
  darwin: ['file too short', 'not a mach-o file'],
  aix: ['Cannot load module',
        'Cannot run a file that does not have a valid format.',
        'Exec format error'],
  ibmi: ['Cannot load module',
         'The module has too many section headers',
         'or the file has been truncated.'],
};
const platform = common.isIBMi ? 'ibmi' : process.platform;
const errorMessages = errorMessagesByPlatform[platform] || [''];
let localeOk = true;
if (common.isWindows) {
  const powerShellFindMUI =
    'powershell -NoProfile -ExecutionPolicy Unrestricted -c ' +
    '"(Get-UICulture).TwoLetterISOLanguageName"';
  try {
    localeOk = execSync(powerShellFindMUI).toString('utf8').trim() === 'en';
  } catch {
  }
}
assert.throws(
  (e) => {
    if (localeOk && !errorMessages.some((msg) => e.message.includes(msg)))
      return false;
    return e.name === 'Error';
  }
);
[1, false, null, undefined, {}].forEach((value) => {
  assert.throws(
    () => { require(value); },
    {
      name: 'TypeError',
      code: 'ERR_INVALID_ARG_TYPE',
      message: re
    });
});
assert.throws(
  () => { require(''); },
  {
    name: 'TypeError',
    code: 'ERR_INVALID_ARG_VALUE',
    message: 'The argument \'id\' must be a non-empty string. Received \'\''
  });
assert.throws(
  {
    code: 'MODULE_NOT_FOUND',
  }
);
