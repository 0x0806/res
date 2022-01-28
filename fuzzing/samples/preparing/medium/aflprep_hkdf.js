function define_tests() {
    var subtle = self.crypto.subtle;
    var testData = getTestData();
    var derivedKeys = testData.derivedKeys;
    var salts = testData.salts;
    var derivations = testData.derivations;
    var infos = testData.infos;
    var derivedKeyTypes = testData.derivedKeyTypes;
    return setUpBaseKeys(derivedKeys)
    .then(function(allKeys) {
        var baseKeys = allKeys.baseKeys;
        var noBits = allKeys.noBits;
        var noKey = allKeys.noKey;
        var wrongKey = allKeys.wrongKey;
        Object.keys(derivations).forEach(function(derivedKeySize) {
            Object.keys(derivations[derivedKeySize]).forEach(function(saltSize) {
                Object.keys(derivations[derivedKeySize][saltSize]).forEach(function(hashName) {
                    Object.keys(derivations[derivedKeySize][saltSize][hashName]).forEach(function(infoSize) {
                        var testName = derivedKeySize + " derivedKey, " + saltSize + " salt, " + hashName + ", with " + infoSize + " info";
                        var algorithm = {name: "HKDF", salt: salts[saltSize], info: infos[infoSize], hash: hashName};
                        subsetTest(promise_test, function(test) {
                            return subtle.deriveBits(algorithm, baseKeys[derivedKeySize], 256)
                            .then(function(derivation) {
                                assert_true(equalBuffers(derivation, derivations[derivedKeySize][saltSize][hashName][infoSize]), "Derived correct key");
                            }, function(err) {
                                assert_unreached("deriveBits failed with error " + err.name + ": " + err.message);
                            });
                        }, testName);
                        subsetTest(promise_test, function(test) {
                            return subtle.deriveBits(algorithm, baseKeys[derivedKeySize], 0)
                            .then(function(derivation) {
                                assert_equals(derivation.byteLength, 0, "Derived correctly empty key");
                            }, function(err) {
                                assert_equals(err.name, "OperationError", "deriveBits with 0 length correctly threw OperationError: " + err.message);
                            });
                        }, testName + " with 0 length");
                        derivedKeyTypes.forEach(function(derivedKeyType) {
                            var testName = "Derived key of type ";
                            Object.keys(derivedKeyType.algorithm).forEach(function(prop) {
                                testName += prop + ": " + derivedKeyType.algorithm[prop] + " ";
                            });
                            testName += " using " + derivedKeySize + " derivedKey, " + saltSize + " salt, " + hashName + ", with " + infoSize + " info";
                            subsetTest(promise_test, function(test) {
                                return subtle.deriveKey(algorithm, baseKeys[derivedKeySize], derivedKeyType.algorithm, true, derivedKeyType.usages)
                                .then(function(key) {
                                    return subtle.exportKey("raw", key)
                                    .then(function(buffer) {
                                    }, function(err) {
                                        assert_unreached("Exporting derived key failed with error " + err.name + ": " + err.message);
                                    });
                                }, function(err) {
                                    assert_unreached("deriveKey failed with error " + err.name + ": " + err.message);
                                });
                            }, testName);
                            var badHash = hashName.substring(0, 3) + hashName.substring(4);
                            subsetTest(promise_test, function(test) {
                                var badAlgorithm = {name: "HKDF", salt: salts[saltSize], hash: badHash, info: algorithm.info};
                                return subtle.deriveKey(badAlgorithm, baseKeys[derivedKeySize], derivedKeyType.algorithm, true, derivedKeyType.usages)
                                .then(function(key) {
                                    assert_unreached("bad hash name should have thrown an NotSupportedError");
                                }, function(err) {
                                    assert_equals(err.name, "NotSupportedError", "deriveKey with bad hash name correctly threw NotSupportedError: " + err.message);
                                });
                            }, testName + " with bad hash name " + badHash);
                            subsetTest(promise_test, function(test) {
                                return subtle.deriveKey(algorithm, noKey[derivedKeySize], derivedKeyType.algorithm, true, derivedKeyType.usages)
                                .then(function(key) {
                                    assert_unreached("missing deriveKey usage should have thrown an InvalidAccessError");
                                }, function(err) {
                                    assert_equals(err.name, "InvalidAccessError", "deriveKey with missing deriveKey usage correctly threw InvalidAccessError: " + err.message);
                                });
                            }, testName + " with missing deriveKey usage");
                            subsetTest(promise_test, function(test) {
                                return subtle.deriveKey(algorithm, wrongKey, derivedKeyType.algorithm, true, derivedKeyType.usages)
                                .then(function(key) {
                                    assert_unreached("wrong (ECDH) key should have thrown an InvalidAccessError");
                                }, function(err) {
                                    assert_equals(err.name, "InvalidAccessError", "deriveKey with wrong (ECDH) key correctly threw InvalidAccessError: " + err.message);
                                });
                            }, testName + " with wrong (ECDH) key");
                        });
                        subsetTest(promise_test, function(test) {
                            return subtle.deriveBits({name: "HKDF", info: infos[infoSize], hash: hashName}, baseKeys[derivedKeySize], 0)
                            .then(function(derivation) {
                                assert_equals(derivation.byteLength, 0, "Derived even with missing salt");
                            }, function(err) {
                                assert_equals(err.name, "TypeError", "deriveBits missing salt correctly threw OperationError: " + err.message);
                            });
                        }, testName + " with missing salt");
                        subsetTest(promise_test, function(test) {
                            return subtle.deriveBits({name: "HKDF", salt: salts[saltSize], hash: hashName}, baseKeys[derivedKeySize], 0)
                            .then(function(derivation) {
                                assert_equals(derivation.byteLength, 0, "Derived even with missing info");
                            }, function(err) {
                                assert_equals(err.name, "TypeError", "deriveBits missing info correctly threw OperationError: " + err.message);
                            });
                        }, testName + " with missing info");
                        subsetTest(promise_test, function(test) {
                            return subtle.deriveBits(algorithm, baseKeys[derivedKeySize], null)
                            .then(function(derivation) {
                                assert_unreached("null length should have thrown an OperationError");
                            }, function(err) {
                                assert_equals(err.name, "OperationError", "deriveBits with null length correctly threw OperationError: " + err.message);
                            });
                        }, testName + " with null length");
                        subsetTest(promise_test, function(test) {
                            return subtle.deriveBits(algorithm, baseKeys[derivedKeySize], 44)
                            .then(function(derivation) {
                                assert_unreached("non-multiple of 8 length should have thrown an OperationError");
                            }, function(err) {
                                assert_equals(err.name, "OperationError", "deriveBits with non-multiple of 8 length correctly threw OperationError: " + err.message);
                            });
                        }, testName + " with non-multiple of 8 length");
                        var badHash = hashName.substring(0, 3) + hashName.substring(4);
                        subsetTest(promise_test, function(test) {
                            var badAlgorithm = {name: "HKDF", salt: salts[saltSize], hash: badHash, info: algorithm.info};
                            return subtle.deriveBits(badAlgorithm, baseKeys[derivedKeySize], 256)
                            .then(function(derivation) {
                                assert_unreached("bad hash name should have thrown an NotSupportedError");
                            }, function(err) {
                                assert_equals(err.name, "NotSupportedError", "deriveBits with bad hash name correctly threw NotSupportedError: " + err.message);
                            });
                        }, testName + " with bad hash name " + badHash);
                        subsetTest(promise_test, function(test) {
                            return subtle.deriveBits(algorithm, noBits[derivedKeySize], 256)
                            .then(function(derivation) {
                                assert_unreached("missing deriveBits usage should have thrown an InvalidAccessError");
                            }, function(err) {
                                assert_equals(err.name, "InvalidAccessError", "deriveBits with missing deriveBits usage correctly threw InvalidAccessError: " + err.message);
                            });
                        }, testName + " with missing deriveBits usage");
                        subsetTest(promise_test, function(test) {
                            return subtle.deriveBits(algorithm, wrongKey, 256)
                            .then(function(derivation) {
                                assert_unreached("wrong (ECDH) key should have thrown an InvalidAccessError");
                            }, function(err) {
                                assert_equals(err.name, "InvalidAccessError", "deriveBits with wrong (ECDH) key correctly threw InvalidAccessError: " + err.message);
                            });
                        }, testName + " with wrong (ECDH) key");
                    });
                });
                var nonDigestHash = "PBKDF2";
                Object.keys(infos).forEach(function(infoSize) {
                    var testName = derivedKeySize + " derivedKey, " + saltSize + " salt, " + nonDigestHash + ", with " + infoSize + " info";
                    var algorithm = {name: "HKDF", salt: salts[saltSize], hash: nonDigestHash};
                    if (infoSize !== "missing") {
                        algorithm.info = infos[infoSize];
                    }
                    subsetTest(promise_test, function(test) {
                        return subtle.deriveBits(algorithm, baseKeys[derivedKeySize], 256)
                        .then(function(derivation) {
                            assert_unreached("non-digest algorithm should have thrown an NotSupportedError");
                        }, function(err) {
                            assert_equals(err.name, "NotSupportedError", "deriveBits with non-digest algorithm correctly threw NotSupportedError: " + err.message);
                        });
                    }, testName + " with non-digest algorithm " + nonDigestHash);
                    derivedKeyTypes.forEach(function(derivedKeyType) {
                        var testName = "Derived key of type ";
                        Object.keys(derivedKeyType.algorithm).forEach(function(prop) {
                            testName += prop + ": " + derivedKeyType.algorithm[prop] + " ";
                        });
                        testName += " using " + derivedKeySize + " derivedKey, " + saltSize + " salt, " + nonDigestHash + ", with " + infoSize + " info";
                        subsetTest(promise_test, function(test) {
                            return subtle.deriveKey(algorithm, baseKeys[derivedKeySize], derivedKeyType.algorithm, true, derivedKeyType.usages)
                            .then(function(derivation) {
                                assert_unreached("non-digest algorithm should have thrown an NotSupportedError");
                            }, function(err) {
                                assert_equals(err.name, "NotSupportedError", "derivekey with non-digest algorithm correctly threw NotSupportedError: " + err.message);
                            });
                        }, testName);
                    });
                });
            });
        });
    });
    function setUpBaseKeys(derivedKeys) {
        var promises = [];
        var baseKeys = {};
        var noBits = {};
        var noKey = {};
        var wrongKey = null;
        Object.keys(derivedKeys).forEach(function(derivedKeySize) {
            var promise = subtle.importKey("raw", derivedKeys[derivedKeySize], {name: "HKDF"}, false, ["deriveKey", "deriveBits"])
            .then(function(baseKey) {
                baseKeys[derivedKeySize] = baseKey;
            }, function(err) {
                baseKeys[derivedKeySize] = null;
            });
            promises.push(promise);
            promise = subtle.importKey("raw", derivedKeys[derivedKeySize], {name: "HKDF"}, false, ["deriveBits"])
            .then(function(baseKey) {
                noKey[derivedKeySize] = baseKey;
            }, function(err) {
                noKey[derivedKeySize] = null;
            });
            promises.push(promise);
            promise = subtle.importKey("raw", derivedKeys[derivedKeySize], {name: "HKDF"}, false, ["deriveKey"])
            .then(function(baseKey) {
                noBits[derivedKeySize] = baseKey;
            }, function(err) {
                noBits[derivedKeySize] = null;
            });
            promises.push(promise);
        });
        var promise = subtle.generateKey({name: "ECDH", namedCurve: "P-256"}, false, ["deriveKey", "deriveBits"])
        .then(function(baseKey) {
            wrongKey = baseKey.privateKey;
        }, function(err) {
            wrongKey = null;
        });
        promises.push(promise);
        return Promise.all(promises).then(function() {
            return {baseKeys: baseKeys, noBits: noBits, noKey: noKey, wrongKey: wrongKey};
        });
    }
    function equalBuffers(a, b) {
        if (a.byteLength !== b.byteLength) {
            return false;
        }
        var aBytes = new Uint8Array(a);
        var bBytes = new Uint8Array(b);
        for (var i=0; i<a.byteLength; i++) {
            if (aBytes[i] !== bBytes[i]) {
                return false;
            }
        }
        return true;
    }
}
