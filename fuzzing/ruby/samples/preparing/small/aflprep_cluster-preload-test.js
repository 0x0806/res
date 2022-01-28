const cluster = require('cluster');
if (cluster.isPrimary) {
  cluster.on('exit', function(worker, code, signal) {
    console.log(`worker terminated with code ${code}`);
  });
}
