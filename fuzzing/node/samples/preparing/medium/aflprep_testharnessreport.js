 * This file is intended for vendors to implement code needed to integrate
 * testharness.js tests with their own test systems.
 *
 * Typically test system integration will attach callbacks when each test has
 * run, using add_result_callback(callback(test)), or when the whole test file
 * has completed, using
 * add_completion_callback(callback(tests, harness_status)).
 *
 * For more documentation about the callback functions and the
 * parameters they are called with see testharness.js
function dump_test_results(tests, status) {
    var results_element = document.createElement("script");
    results_element.id = "__testharness__results__";
    var test_results = tests.map(function(x) {
        return {name:x.name, status:x.status, message:x.message, stack:x.stack}
    });
    var data = {test:window.location.href,
                tests:test_results,
                status: status.status,
                message: status.message,
                stack: status.stack};
    results_element.textContent = JSON.stringify(data);
    var parent = document.body
    parent.appendChild(results_element);
}
add_completion_callback(dump_test_results);
 * we use this to provide the test settings. This is used by the
 * default in-browser runner to configure the timeout and the
 * rendering of results
try {
    if (window.opener && "testharness_properties" in window.opener) {
         * JSON stringifying and reparsing it, IE fails & emits the message
         * "Could not complete the operation due to error 80700019".
        setup(JSON.parse(JSON.stringify(window.opener.testharness_properties)));
    }
} catch (e) {
}
