'use strict';
const http = require('http');
const NUMBER_OF_EXCEPTIONS = 4;
const countdown = new Countdown(NUMBER_OF_EXCEPTIONS, () => {
  process.exit(0);
});
const server = http.createServer(function(req, res) {
  res.write('Thank you, come again.');
  res.end();
});
function onUncaughtException(err) {
  console.log(`Caught an exception: ${err}`);
  if (err.name === 'AssertionError') throw err;
  countdown.dec();
}
process.on('uncaughtException', onUncaughtException);
server.listen(0, function() {
  for (let i = 0; i < NUMBER_OF_EXCEPTIONS; i += 1) {
  }
});
