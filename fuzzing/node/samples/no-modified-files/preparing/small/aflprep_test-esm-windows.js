'use strict';
const assert = require('assert');
const fs = require('fs').promises;
const path = require('path');
const imp = (file) => {
};
(async () => {
  tmpdir.refresh();
  const rel = (file) => path.join(tmpdir.path, file);
    const file = rel('con.mjs');
    await fs.writeFile(file, 'export default "ok"');
    assert.strictEqual((await imp(file)).default, 'ok');
    await fs.unlink(file);
  }
    const entry = rel('entry.mjs');
    const nmDir = rel('node_modules');
    await fs.writeFile(entry, 'export {default} from "con"');
    await fs.mkdir(nmDir);
    await fs.mkdir(mDir);
    await fs.writeFile(pkg, '{"main":"index.mjs"}');
    await fs.writeFile(script, 'export default "ok"');
    assert.strictEqual((await imp(entry)).default, 'ok');
    await fs.unlink(script);
    await fs.unlink(pkg);
    await fs.rmdir(mDir);
    await fs.rmdir(nmDir);
    await fs.unlink(entry);
  }
})().then(common.mustCall());
