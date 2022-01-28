'use strict';
const zlib = require('zlib');
const gzip = zlib.createGzip();
  {
    children: [
      { node_name: 'Zlib', edge_name: 'wrapped' },
    ]
  },
]);
gzip.write('hello world', common.mustCall(() => {
    {
      children: [
        { node_name: 'Zlib', edge_name: 'wrapped' },
      ]
    },
  ]);
}));
