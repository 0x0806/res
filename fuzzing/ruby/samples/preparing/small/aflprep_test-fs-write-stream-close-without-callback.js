'use strict';
const fs = require('fs');
const path = require('path');
tmpdir.refresh();
const s = fs.createWriteStream(path.join(tmpdir.path, 'nocallback'));
s.end('hello world');
s.close();
