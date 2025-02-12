const iterations = 256;
const uuids = new Set()
function randomUUID() {
    const uuid = self.crypto.randomUUID();
    if (uuids.has(uuid)) {
        throw new Error(`uuid collision ${uuid}`)
    }
    uuids.add(uuid);
    return uuid;
}
test(function() {
    for (let i = 0; i < iterations; i++) {
        assert_true(UUIDRegex.test(randomUUID()));
    }
}, "namespace format");
test(function() {
    for (let i = 0; i < iterations; i++) {
        let value = parseInt(randomUUID().split('-')[2].slice(0, 2), 16);
        value &= 0b11110000;
        assert_true(value === 0b01000000);
    }
}, "version set");
test(function() {
    for (let i = 0; i < iterations; i++) {
        let value = parseInt(randomUUID().split('-')[3].slice(0, 2), 16);
        value &= 0b11000000
        assert_true(value === 0b10000000);
    }
}, "variant set");
