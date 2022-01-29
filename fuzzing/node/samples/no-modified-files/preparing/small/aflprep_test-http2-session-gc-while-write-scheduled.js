'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const http2 = require('http2');
{
    createConnection: common.mustCall(() => makeDuplexPair().clientSide)
  });
  tick(10, () => {
    client.settings(http2.getDefaultSettings());
    client = null;
    global.gc();
  });
}
