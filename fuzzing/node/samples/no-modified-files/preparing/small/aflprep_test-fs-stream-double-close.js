'use strict';
const fs = require('fs');
tmpdir.refresh();
test1(fs.createReadStream(__filename));
test2(fs.createReadStream(__filename));
test3(fs.createReadStream(__filename));
function test1(stream) {
  stream.destroy();
  stream.destroy();
}
function test2(stream) {
  stream.destroy();
  stream.on('open', common.mustCall(function(fd) {
    stream.destroy();
  }));
}
function test3(stream) {
  stream.on('open', common.mustCall(function(fd) {
    stream.destroy();
    stream.destroy();
  }));
}
