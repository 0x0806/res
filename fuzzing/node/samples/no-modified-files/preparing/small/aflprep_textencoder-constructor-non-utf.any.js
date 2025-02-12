encodings_table.forEach(function(section) {
    section.encodings.forEach(function(encoding) {
        if (encoding.name !== 'replacement') {
            test(function() {
            }, 'Encoding argument supported for decode: ' + encoding.name);
        }
        test(function() {
            assert_equals(new TextEncoder(encoding.name).encoding, 'utf-8');
        }, 'Encoding argument not considered for encode: ' + encoding.name);
    });
});
