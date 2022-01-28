const net = require('net');
var receivedData = [];
var receivedFDs = [];
var numSentMessages = 0;
function processData(s) {
  if (receivedData.length == 0 || receivedFDs.length == 0) {
    return;
  }
  var fd = receivedFDs.shift();
  var d = receivedData.shift();
  d.pid = process.pid;
  var pipeStream = new net.Stream(fd);
  var drainFunc = function() {
    pipeStream.destroy();
    if (++numSentMessages == 2) {
      s.destroy();
    }
  };
  pipeStream.on('drain', drainFunc);
  pipeStream.resume();
  if (pipeStream.write(JSON.stringify(d) + '\n')) {
    drainFunc();
  }
}
var s = new net.Stream();
s.on('fd', function(fd) {
  receivedFDs.unshift(fd);
  processData(s);
});
s.on('data', function(data) {
  data.toString('utf8').trim().split('\n').forEach(function(d) {
    receivedData.unshift(JSON.parse(d));
  });
  processData(s);
});
s.connect(process.argv[2]);
