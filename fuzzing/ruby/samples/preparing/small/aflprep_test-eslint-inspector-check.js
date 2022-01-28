'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
common.skipIfEslintMissing();
const message = 'Please add a skipIfInspectorDisabled() call to allow this ' +
                'test to be skipped when Node is built ' +
                '\'--without-inspector\'.';
new RuleTester().run('inspector-check', rule, {
  valid: [
    'foo;',
    'require("common")\n' +
      'common.skipIfInspectorDisabled();\n' +
      'require("inspector")',
  ],
  invalid: [
    {
      code: 'require("common")\n' +
            'require("inspector")',
      errors: [{ message }],
      output: 'require("common")\n' +
              'common.skipIfInspectorDisabled();\n' +
              'require("inspector")'
    },
  ]
});
