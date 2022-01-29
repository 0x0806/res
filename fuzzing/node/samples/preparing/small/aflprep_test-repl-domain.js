'use strict';
const repl = require('repl');
const putIn = new ArrayStream();
repl.start('', putIn);
putIn.write = function(data) {
  if (data === 'OK\n') {
    console.log('ok');
  } else {
    console.error(data);
    process.exit(1);
  }
};
putIn.run([
  'require("domain").create().on("error", function() { console.log("OK") })' +
  '.run(function() { throw new Error("threw") })',
]);
