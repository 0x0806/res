function define_tests() {
    var subtle = self.crypto.subtle;
    var testData = getTestData();
    var passwords = testData.passwords;
    var salts = testData.salts;
    var derivations = testData.derivations;
    var derivedKeyTypes = testData.derivedKeyTypes;
    return setUpBaseKeys(passwords)
    .then(function(allKeys) {
        var baseKeys = allKeys.baseKeys;
        var noBits = allKeys.noBits;
        var noKey = allKeys.noKey;
        var wrongKey = allKeys.wrongKey;
        Object.keys(derivations).forEach(function(passwordSize) {
            Object.keys(derivations[passwordSize]).forEach(function(saltSize) {
                Object.keys(derivations[passwordSize][saltSize]).forEach(function(hashName) {
                    Object.keys(derivations[passwordSize][saltSize][hashName]).forEach(function(iterations) {
                        var testName = passwordSize + " password, " + saltSize + " salt, " + hashName + ", with " + iterations + " iterations";
                        subsetTest(promise_test, function(test) {
                            return subtle.deriveBits({name: "PBKDF2", salt: salts[saltSize], hash: hashName, iterations: parseInt(iterations)}, baseKeys[passwordSize], 256)
                            .then(function(derivation) {
                                assert_true(equalBuffers(derivation, derivations[passwordSize][saltSize][hashName][iterations]), "Derived correct key");
                            }, function(err) {
                                assert_unreached("deriveBits failed with error " + err.name + ": " + err.message);
                            });
                        }, testName);
                        derivedKeyTypes.forEach(function(derivedKeyType) {
                            var testName = "Derived key of type ";
                            Object.keys(derivedKeyType.algorithm).forEach(function(prop) {
                                testName += prop + ": " + derivedKeyType.algorithm[prop] + " ";
                            });
                            testName += " using " + passwordSize + " password, " + saltSize + " salt, " + hashName + ", with " + iterations + " iterations";
                            subsetTest(promise_test, function(test) {
                                return subtle.deriveKey({name: "PBKDF2", salt: salts[saltSize], hash: hashName, iterations: parseInt(iterations)}, baseKeys[passwordSize], derivedKeyType.algorithm, true, derivedKeyType.usages)
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
                                return subtle.deriveKey({name: "PBKDF2", salt: salts[saltSize], hash: badHash, iterations: parseInt(iterations)}, baseKeys[passwordSize], derivedKeyType.algorithm, true, derivedKeyType.usages)
                                .then(function(key) {
                                    assert_unreached("bad hash name should have thrown an NotSupportedError");
                                }, function(err) {
                                    assert_equals(err.name, "NotSupportedError", "deriveKey with bad hash name correctly threw NotSupportedError: " + err.message);
                                });
                            }, testName + " with bad hash name " + badHash);
                            subsetTest(promise_test, function(test) {
                                return subtle.deriveKey({name: "PBKDF2", salt: salts[saltSize], hash: hashName, iterations: parseInt(iterations)}, noKey[passwordSize], derivedKeyType.algorithm, true, derivedKeyType.usages)
                                .then(function(key) {
                                    assert_unreached("missing deriveKey usage should have thrown an InvalidAccessError");
                                }, function(err) {
                                    assert_equals(err.name, "InvalidAccessError", "deriveKey with missing deriveKey usage correctly threw InvalidAccessError: " + err.message);
                                });
                            }, testName + " with missing deriveKey usage");
                            subsetTest(promise_test, function(test) {
                                return subtle.deriveKey({name: "PBKDF2", salt: salts[saltSize], hash: hashName, iterations: parseInt(iterations)}, wrongKey, derivedKeyType.algorithm, true, derivedKeyType.usages)
                                .then(function(key) {
                                    assert_unreached("wrong (ECDH) key should have thrown an InvalidAccessError");
                                }, function(err) {
                                    assert_equals(err.name, "InvalidAccessError", "deriveKey with wrong (ECDH) key correctly threw InvalidAccessError: " + err.message);
                                });
                            }, testName + " with wrong (ECDH) key");
                        });
                        subsetTest(promise_test, function(test) {
                            return subtle.deriveBits({name: "PBKDF2", salt: salts[saltSize], hash: hashName, iterations: parseInt(iterations)}, baseKeys[passwordSize], null)
                            .then(function(derivation) {
                                assert_unreached("null length should have thrown an OperationError");
                            }, function(err) {
                                assert_equals(err.name, "OperationError", "deriveBits with null length correctly threw OperationError: " + err.message);
                            });
                        }, testName + " with null length");
                        subsetTest(promise_test, function(test) {
                            return subtle.deriveBits({name: "PBKDF2", salt: salts[saltSize], hash: hashName, iterations: parseInt(iterations)}, baseKeys[passwordSize], 0)
                            .then(function(derivation) {
                                assert_unreached("0 length should have thrown an OperationError");
                            }, function(err) {
                                assert_equals(err.name, "OperationError", "deriveBits with 0 length correctly threw OperationError: " + err.message);
                            });
                        }, testName + " with 0 length");
                        subsetTest(promise_test, function(test) {
                            return subtle.deriveBits({name: "PBKDF2", salt: salts[saltSize], hash: hashName, iterations: parseInt(iterations)}, baseKeys[passwordSize], 44)
                            .then(function(derivation) {
                                assert_unreached("non-multiple of 8 length should have thrown an OperationError");
                            }, function(err) {
                                assert_equals(err.name, "OperationError", "deriveBits with non-multiple of 8 length correctly threw OperationError: " + err.message);
                            });
                        }, testName + " with non-multiple of 8 length");
                        var badHash = hashName.substring(0, 3) + hashName.substring(4);
                        subsetTest(promise_test, function(test) {
                            return subtle.deriveBits({name: "PBKDF2", salt: salts[saltSize], hash: badHash, iterations: parseInt(iterations)}, baseKeys[passwordSize], 256)
                            .then(function(derivation) {
                                assert_unreached("bad hash name should have thrown an NotSupportedError");
                            }, function(err) {
                                assert_equals(err.name, "NotSupportedError", "deriveBits with bad hash name correctly threw NotSupportedError: " + err.message);
                            });
                        }, testName + " with bad hash name " + badHash);
                        subsetTest(promise_test, function(test) {
                            return subtle.deriveBits({name: "PBKDF2", salt: salts[saltSize], hash: hashName, iterations: parseInt(iterations)}, noBits[passwordSize], 256)
                            .then(function(derivation) {
                                assert_unreached("missing deriveBits usage should have thrown an InvalidAccessError");
                            }, function(err) {
                                assert_equals(err.name, "InvalidAccessError", "deriveBits with missing deriveBits usage correctly threw InvalidAccessError: " + err.message);
                            });
                        }, testName + " with missing deriveBits usage");
                        subsetTest(promise_test, function(test) {
                            return subtle.deriveBits({name: "PBKDF2", salt: salts[saltSize], hash: hashName, iterations: parseInt(iterations)}, wrongKey, 256)
                            .then(function(derivation) {
                                assert_unreached("wrong (ECDH) key should have thrown an InvalidAccessError");
                            }, function(err) {
                                assert_equals(err.name, "InvalidAccessError", "deriveBits with wrong (ECDH) key correctly threw InvalidAccessError: " + err.message);
                            });
                        }, testName + " with wrong (ECDH) key");
                    });
                    subsetTest(promise_test, function(test) {
                        return subtle.deriveBits({name: "PBKDF2", salt: salts[saltSize], hash: hashName, iterations: 0}, baseKeys[passwordSize], 256)
                        .then(function(derivation) {
                            assert_unreached("0 iterations should have thrown an error");
                        }, function(err) {
                            assert_equals(err.name, "OperationError", "deriveBits with 0 iterations correctly threw OperationError: " + err.message);
                        });
                    }, passwordSize + " password, " + saltSize + " salt, " + hashName + ", with 0 iterations");
                    derivedKeyTypes.forEach(function(derivedKeyType) {
                        var testName = "Derived key of type ";
                        Object.keys(derivedKeyType.algorithm).forEach(function(prop) {
                            testName += prop + ": " + derivedKeyType.algorithm[prop] + " ";
                        });
                        testName += " using " + passwordSize + " password, " + saltSize + " salt, " + hashName + ", with 0 iterations";
                        subsetTest(promise_test, function(test) {
                            return subtle.deriveKey({name: "PBKDF2", salt: salts[saltSize], hash: hashName, iterations: 0}, baseKeys[passwordSize], derivedKeyType.algorithm, true, derivedKeyType.usages)
                            .then(function(derivation) {
                                assert_unreached("0 iterations should have thrown an error");
                            }, function(err) {
                                assert_equals(err.name, "OperationError", "derivekey with 0 iterations correctly threw OperationError: " + err.message);
                            });
                        }, testName);
                    });
                });
                var nonDigestHash = "PBKDF2";
                [1, 1000, 100000].forEach(function(iterations) {
                    var testName = passwordSize + " password, " + saltSize + " salt, " + nonDigestHash + ", with " + iterations + " iterations";
                    subsetTest(promise_test, function(test) {
                        return subtle.deriveBits({name: "PBKDF2", salt: salts[saltSize], hash: nonDigestHash, iterations: parseInt(iterations)}, baseKeys[passwordSize], 256)
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
                        testName += " using " + passwordSize + " password, " + saltSize + " salt, " + nonDigestHash + ", with " + iterations + " iterations";
                        subsetTest(promise_test, function(test) {
                            return subtle.deriveKey({name: "PBKDF2", salt: salts[saltSize], hash: nonDigestHash, iterations: parseInt(iterations)}, baseKeys[passwordSize], derivedKeyType.algorithm, true, derivedKeyType.usages)
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
    function setUpBaseKeys(passwords) {
        var promises = [];
        var baseKeys = {};
        var noBits = {};
        var noKey = {};
        var wrongKey = null;
        Object.keys(passwords).forEach(function(passwordSize) {
            var promise = subtle.importKey("raw", passwords[passwordSize], {name: "PBKDF2"}, false, ["deriveKey", "deriveBits"])
            .then(function(baseKey) {
                baseKeys[passwordSize] = baseKey;
            }, function(err) {
                baseKeys[passwordSize] = null;
            });
            promises.push(promise);
            promise = subtle.importKey("raw", passwords[passwordSize], {name: "PBKDF2"}, false, ["deriveBits"])
            .then(function(baseKey) {
                noKey[passwordSize] = baseKey;
            }, function(err) {
                noKey[passwordSize] = null;
            });
            promises.push(promise);
            promise = subtle.importKey("raw", passwords[passwordSize], {name: "PBKDF2"}, false, ["deriveKey"])
            .then(function(baseKey) {
                noBits[passwordSize] = baseKey;
            }, function(err) {
                noBits[passwordSize] = null;
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
