 * Host information for cross-origin tests.
 * @returns {Object} with properties for different host information.
function get_host_info() {
  var HTTP_PORT = '{{ports[http][0]}}';
  var HTTP_PORT2 = '{{ports[http][1]}}';
  var HTTPS_PORT = '{{ports[https][0]}}';
  var HTTPS_PORT2 = '{{ports[https][1]}}';
  var PROTOCOL = self.location.protocol;
  var IS_HTTPS = (PROTOCOL == "https:");
  var PORT = IS_HTTPS ? HTTPS_PORT : HTTP_PORT;
  var PORT2 = IS_HTTPS ? HTTPS_PORT2 : HTTP_PORT2;
  var HTTP_PORT_ELIDED = HTTP_PORT == "80" ? "" : (":" + HTTP_PORT);
  var HTTP_PORT2_ELIDED = HTTP_PORT2 == "80" ? "" : (":" + HTTP_PORT2);
  var HTTPS_PORT_ELIDED = HTTPS_PORT == "443" ? "" : (":" + HTTPS_PORT);
  var PORT_ELIDED = IS_HTTPS ? HTTPS_PORT_ELIDED : HTTP_PORT_ELIDED;
  var ORIGINAL_HOST = '{{host}}';
  var REMOTE_HOST = (ORIGINAL_HOST === 'localhost') ? '127.0.0.1' : ('www1.' + ORIGINAL_HOST);
  var OTHER_HOST = '{{domains[www2]}}';
  var NOTSAMESITE_HOST = (ORIGINAL_HOST === 'localhost') ? '127.0.0.1' : ('{{hosts[alt][]}}');
  return {
    HTTP_PORT: HTTP_PORT,
    HTTP_PORT2: HTTP_PORT2,
    HTTPS_PORT: HTTPS_PORT,
    HTTPS_PORT2: HTTPS_PORT2,
    PORT: PORT,
    PORT2: PORT2,
    ORIGINAL_HOST: ORIGINAL_HOST,
    REMOTE_HOST: REMOTE_HOST,
  };
}
 * When a default port is used, location.port returns the empty string.
 * This function attempts to provide an exact port, assuming we are running under wptserve.
 * @returns {string} The port number.
function get_port(loc) {
  if (loc.port) {
    return loc.port;
  }
  return loc.protocol === 'https:' ? '443' : '80';
}
