'use strict';
const util = require('util');
const { JSStream } = internalBinding('js_stream');
util.inspect(new JSStream());
