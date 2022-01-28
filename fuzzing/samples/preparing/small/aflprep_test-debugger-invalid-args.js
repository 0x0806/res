'use strict';
common.skipIfInspectorDisabled();
const assert = require('assert');
{
  const cli = startCLI([]);
  cli.quit()
    .then((code) => {
      assert.strictEqual(code, 1);
    });
}
{
  const cli = startCLI([`localhost:${common.PORT}`]);
  cli.quit()
    .then((code) => {
      assert.match(
        cli.output,
        'Tells the user that the connection failed');
      assert.strictEqual(code, 1);
    });
}
