'use strict';
common.expectWarning('DeprecationWarning',
                     'The _stream_wrap module is deprecated.', 'DEP0125');
require('_stream_wrap');
