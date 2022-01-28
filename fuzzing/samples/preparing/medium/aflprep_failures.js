function run_test(algorithmNames) {
    setup({explicit_timeout: true});
        {name: "AES-CTR",  resultType: CryptoKey, usages: ["encrypt", "decrypt", "wrapKey", "unwrapKey"], mandatoryUsages: []},
        {name: "AES-CBC",  resultType: CryptoKey, usages: ["encrypt", "decrypt", "wrapKey", "unwrapKey"], mandatoryUsages: []},
        {name: "AES-GCM",  resultType: CryptoKey, usages: ["encrypt", "decrypt", "wrapKey", "unwrapKey"], mandatoryUsages: []},
        {name: "AES-KW",   resultType: CryptoKey, usages: ["wrapKey", "unwrapKey"], mandatoryUsages: []},
        {name: "HMAC",     resultType: CryptoKey, usages: ["sign", "verify"], mandatoryUsages: []},
        {name: "RSASSA-PKCS1-v1_5", resultType: "CryptoKeyPair", usages: ["sign", "verify"], mandatoryUsages: ["sign"]},
        {name: "RSA-PSS",  resultType: "CryptoKeyPair", usages: ["sign", "verify"], mandatoryUsages: ["sign"]},
        {name: "RSA-OAEP", resultType: "CryptoKeyPair", usages: ["encrypt", "decrypt", "wrapKey", "unwrapKey"], mandatoryUsages: ["decrypt", "unwrapKey"]},
        {name: "ECDSA",    resultType: "CryptoKeyPair", usages: ["sign", "verify"], mandatoryUsages: ["sign"]},
        {name: "ECDH",     resultType: "CryptoKeyPair", usages: ["deriveKey", "deriveBits"], mandatoryUsages: ["deriveKey", "deriveBits"]}
    ];
    var testVectors = [];
    if (algorithmNames && !Array.isArray(algorithmNames)) {
        algorithmNames = [algorithmNames];
    };
    allTestVectors.forEach(function(vector) {
        if (!algorithmNames || algorithmNames.includes(vector.name)) {
            testVectors.push(vector);
        }
    });
    function parameterString(algorithm, extractable, usages) {
        if (typeof algorithm !== "object" && typeof algorithm !== "string") {
            alert(algorithm);
        }
        var result = "(" +
                        objectToString(algorithm) + ", " +
                        objectToString(extractable) + ", " +
                        objectToString(usages) +
                     ")";
        return result;
    }
    function testError(algorithm, extractable, usages, expectedError, testTag) {
        promise_test(function(test) {
            return crypto.subtle.generateKey(algorithm, extractable, usages)
            .then(function(result) {
                assert_unreached("Operation succeeded, but should not have");
            }, function(err) {
                if (typeof expectedError === "number") {
                    assert_equals(err.code, expectedError, testTag + " not supported");
                } else {
                    assert_equals(err.name, expectedError, testTag + " not supported");
                }
            });
        }, testTag + ": generateKey" + parameterString(algorithm, extractable, usages));
    }
    function badAlgorithmPropertySpecifiersFor(algorithmName) {
        var results = [];
        if (algorithmName.toUpperCase().substring(0, 3) === "AES") {
            [64, 127, 129, 255, 257, 512].forEach(function(length) {
                results.push({name: algorithmName, length: length});
            });
        } else if (algorithmName.toUpperCase().substring(0, 3) === "RSA") {
            [new Uint8Array([1]), new Uint8Array([1,0,0])].forEach(function(publicExponent) {
                results.push({name: algorithmName, hash: "SHA-256", modulusLength: 1024, publicExponent: publicExponent});
            });
        } else if (algorithmName.toUpperCase().substring(0, 2) === "EC") {
            ["P-512", "Curve25519"].forEach(function(curveName) {
                results.push({name: algorithmName, namedCurve: curveName});
            });
        }
        return results;
    }
    function invalidUsages(validUsages, mandatoryUsages) {
        var results = [];
        var illegalUsages = [];
        ["encrypt", "decrypt", "sign", "verify", "wrapKey", "unwrapKey", "deriveKey", "deriveBits"].forEach(function(usage) {
            if (!validUsages.includes(usage)) {
                illegalUsages.push(usage);
            }
        });
        var goodUsageCombinations = allValidUsages(validUsages, false, mandatoryUsages);
        illegalUsages.forEach(function(illegalUsage) {
            results.push([illegalUsage]);
            goodUsageCombinations.forEach(function(usageCombination) {
                results.push(usageCombination.concat([illegalUsage]));
            });
        });
        return results;
    }
    var badAlgorithmNames = [
        "AES",
        {name: "AES"},
        {name: "AES", length: 128},
        {name: "HMAC", hash: "MD5"},
        {name: "RSA", hash: "SHA-256", modulusLength: 2048, publicExponent: new Uint8Array([1,0,1])},
        {name: "RSA-PSS", hash: "SHA", modulusLength: 2048, publicExponent: new Uint8Array([1,0,1])},
        {name: "EC", namedCurve: "P521"}
    ];
    badAlgorithmNames.forEach(function(algorithm) {
        .forEach(function(usages) {
            [false, true, "RED", 7].forEach(function(extractable){
                testError(algorithm, extractable, usages, "NotSupportedError", "Bad algorithm");
            });
        });
    });
    testVectors.forEach(function(vector) {
        var name = vector.name;
        allAlgorithmSpecifiersFor(name).forEach(function(algorithm) {
            invalidUsages(vector.usages, vector.mandatoryUsages).forEach(function(usages) {
                [true].forEach(function(extractable) {
                    testError(algorithm, extractable, usages, "SyntaxError", "Bad usages");
                });
            });
        });
    });
    testVectors.forEach(function(vector) {
        var name = vector.name;
        badAlgorithmPropertySpecifiersFor(name).forEach(function(algorithm) {
            allValidUsages(vector.usages, true, vector.mandatoryUsages)
            .forEach(function(usages) {
                [false, true].forEach(function(extractable) {
                    if (name.substring(0,2) === "EC") {
                        testError(algorithm, extractable, usages, "NotSupportedError", "Bad algorithm property");
                    } else {
                        testError(algorithm, extractable, usages, "OperationError", "Bad algorithm property");
                    }
                });
            });
        });
    });
    testVectors.forEach(function(vector) {
        var name = vector.name;
        allAlgorithmSpecifiersFor(name).forEach(function(algorithm) {
            var usages = [];
            [false, true].forEach(function(extractable) {
                testError(algorithm, extractable, usages, "SyntaxError", "Empty usages");
            });
        });
    });
}
