'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const h2 = require('http2');
const server = h2.createServer();
server.on('stream', common.mustNotCall());
server.listen(0, common.mustCall(() => {
  client.close(common.mustCall(() => server.close()));
}));
