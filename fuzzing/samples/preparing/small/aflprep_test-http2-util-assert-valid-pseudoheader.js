'use strict';
const assert = require('assert');
mapToHeaders({ ':status': 'a' });
mapToHeaders({ ':path': 'a' });
mapToHeaders({ ':authority': 'a' });
mapToHeaders({ ':scheme': 'a' });
mapToHeaders({ ':method': 'a' });
assert.throws(() => mapToHeaders({ ':foo': 'a' }), {
  code: 'ERR_HTTP2_INVALID_PSEUDOHEADER',
  name: 'TypeError',
  message: '":foo" is an invalid pseudoheader or is used incorrectly'
});
