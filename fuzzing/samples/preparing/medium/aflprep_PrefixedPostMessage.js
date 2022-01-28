 * Supports pseudo-"namespacing" for window-posted messages for a given test
 * by generating and using a unique prefix that gets wrapped into message
 * objects. This makes it more feasible to have multiple tests that use
 * `window.postMessage` in a single test file. Basically, make it possible
 * for the each test to listen for only the messages that are pertinent to it.
 *
 * 'Prefix' not an elegant term to use here but this models itself after
 * PrefixedLocalStorage.
 *
 * PrefixedMessageTest: Instantiate in testharness.js tests to generate
 *   a new unique-ish prefix that can be used by other test support files
 * PrefixedMessageResource: Instantiate in supporting test resource
var PrefixedMessage = function () {
  this.prefix = '';
};
 * Use to link to test support files that make use of
 * PrefixedMessageResource.
PrefixedMessage.prototype.url = function (uri) {
  function updateUrlParameter (uri, key, value) {
    var i         = uri.indexOf('#');
    var hash      = (i === -1) ? '' : uri.substr(i);
    uri           = (i === -1) ? uri : uri.substr(0, i);
    var re        = new RegExp(`([?&])${key}=.*?(&|$)`, 'i');
    var separator = uri.indexOf('?') !== -1 ? '&' : '?';
    uri = (uri.match(re)) ? uri.replace(re, `$1${key}=${value}$2`) :
      `${uri}${separator}${key}=${value}`;
    return uri + hash;
  }
  return updateUrlParameter(uri, this.param, this.prefix);
};
 * Add an eventListener on `message` but only invoke the given callback
 * for messages whose object contains this object's prefix. Remove the
 * event listener once the anticipated message has been received.
PrefixedMessage.prototype.onMessage = function (fn) {
  window.addEventListener('message', e => {
    if (typeof e.data === 'object' && e.data.hasOwnProperty('prefix')) {
      if (e.data.prefix === this.prefix) {
        fn.call(this, e.data.data, e);
        window.removeEventListener('message', fn);
      }
    }
  });
};
 * Instantiate in a test file (e.g. during `setup`) to create a unique-ish
 * prefix that can be shared by support files
var PrefixedMessageTest = function () {
  PrefixedMessage.call(this);
  this.prefix = `${document.location.pathname}-${Math.random()}-${Date.now()}-`;
};
PrefixedMessageTest.prototype = Object.create(PrefixedMessage.prototype);
PrefixedMessageTest.prototype.constructor = PrefixedMessageTest;
 * Instantiate in a test support script to use a "prefix" generated by a
 * PrefixedMessageTest in a controlling test file. It will look for
 * the prefix in a URL param (see also PrefixedMessage#url)
var PrefixedMessageResource = function () {
  PrefixedMessage.call(this);
  var regex = new RegExp(`[?&]${this.param}(=([^&#]*)|&|#|$)`),
    results = regex.exec(document.location.href);
  if (results && results[2]) {
    this.prefix = results[2];
  }
};
PrefixedMessageResource.prototype = Object.create(PrefixedMessage.prototype);
PrefixedMessageResource.prototype.constructor = PrefixedMessageResource;
 * This is how a test resource document can "send info" to its
 * opener context. It will whatever message is being sent (`data`) in
 * an object that injects the prefix.
PrefixedMessageResource.prototype.postToOpener = function (data) {
  if (window.opener) {
    window.opener.postMessage({
      prefix: this.prefix,
      data: data
    }, '*');
  }
};
