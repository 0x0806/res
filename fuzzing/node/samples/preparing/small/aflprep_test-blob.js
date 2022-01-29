'use strict';
runner.setInitScript(`
  const { Blob } = require('buffer');
  global.Blob = Blob;
  global.ReadableStream = ReadableStream;
`);
runner.runJsTests();
