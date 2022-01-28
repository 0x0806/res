'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
common.skipIfEslintMissing();
const message = 'Please add a skipIfEslintMissing() call to allow this ' +
                'test to be skipped when Node.js is built ' +
                'from a source tarball.';
new RuleTester().run('eslint-check', rule, {
  valid: [
    'foo;',
    'require("common")\n' +
      'common.skipIfEslintMissing();\n' +
  ],
  invalid: [
    {
      code: 'require("common")\n' +
      errors: [{ message }],
      output: 'require("common")\n' +
              'common.skipIfEslintMissing();\n' +
    },
  ]
});
