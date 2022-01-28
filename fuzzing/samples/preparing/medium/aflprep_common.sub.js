 * @fileoverview Utilities for mixed-content in web-platform-tests.
 * @author burnik@google.com (Kristijan Burnik)
 * Disclaimer: Some methods of other authors are annotated in the corresponding
 *     method's JSDoc.
  @typedef PolicyDelivery
  @type {object}
  A PolicyDelivery object specifies what policy is delivered and how.
  @property {string} deliveryType
    Specifies how the policy is delivered.
    The valid deliveryType are:
     "attr"
        [A] DOM attributes e.g. referrerPolicy.
      "rel-noref"
        [A] <link rel="noreferrer"> (referrer-policy only).
      "http-rp"
        [B] HTTP response headers.
      "meta"
        [B] <meta> elements.
  @property {string} key
  @property {string} value
    Specifies what policy to be delivered. The valid keys are:
      "referrerPolicy"
        Referrer Policy
        Valid values are those listed in
  A PolicyDelivery can be specified in several ways:
  - (for [A]) Associated with an individual subresource request and
    specified in `Subresource.policies`,
    e.g. referrerPolicy attributes of DOM elements.
    This is handled in invokeRequest().
  - (for [B]) Associated with an nested environmental settings object and
    specified in `SourceContext.policies`,
  - (for [B]) Associated with the top-level HTML document.
    This is handled by the generators.d
  @typedef Subresource
  @type {object}
  A Subresource represents how a subresource request is sent.
  @property{SubresourceType} subresourceType
    How the subresource request is sent,
    e.g. "img-tag" for sending a request via <img src>.
    See the keys of `subresourceMap` for valid values.
  @property{string} url
    subresource's URL.
    Typically this is constructed by getRequestURLs() below.
  @property{PolicyDelivery} policyDeliveries
    Policies delivered specific to the subresource request.
  @typedef SourceContext
  @type {object}
  @property {string} sourceContextType
    Kind of the source context to be used.
    Valid values are the keys of `sourceContextMap` below.
  @property {Array<PolicyDelivery>} policyDeliveries
    A list of PolicyDelivery applied to the source context.
function timeoutPromise(t, ms) {
  return new Promise(resolve => { t.step_timeout(resolve, ms); });
}
 * Normalizes the target port for use in a URL. For default ports, this is the
 *     empty string (omitted port), otherwise it's a colon followed by the port
 *     number. Ports 80, 443 and an empty string are regarded as default ports.
 * @param {number} targetPort The port to use
 * @return {string} The port portion for using as part of a URL.
function getNormalizedPort(targetPort) {
  return ([80, 443, ""].indexOf(targetPort) >= 0) ? "" : ":" + targetPort;
}
 * Creates a GUID.
 * @return {string} A pseudo-random GUID.
function guid() {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
 * Initiates a new XHR via GET.
 * @param {string} url The endpoint URL for the XHR.
 * @param {string} responseType Optional - how should the response be parsed.
 *     Default is "json".
 * @return {Promise} A promise wrapping the success and error events.
function xhrRequest(url, responseType) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = responseType || "json";
    xhr.addEventListener("error", function() {
      reject(Error("Network Error"));
    });
    xhr.addEventListener("load", function() {
      if (xhr.status != 200)
        reject(Error(xhr.statusText));
      else
        resolve(xhr.response);
    });
    xhr.send();
  });
}
 * Sets attributes on a given DOM element.
 * @param {DOMElement} element The element on which to set the attributes.
 * @param {object} An object with keys (serving as attribute names) and values.
function setAttributes(el, attrs) {
  attrs = attrs || {}
  for (var attr in attrs) {
    if (attr !== 'src')
      el.setAttribute(attr, attrs[attr]);
  }
  for (var attr in attrs) {
    if (attr === 'src')
      el.setAttribute(attr, attrs[attr]);
  }
}
 * Binds to success and error events of an object wrapping them into a promise
 *     available through {@code element.eventPromise}. The success event
 *     resolves and error event rejects.
 * This method adds event listeners, and then removes all the added listeners
 * when one of listened event is fired.
 * @param {object} element An object supporting events on which to bind the
 *     promise.
 * @param {string} resolveEventName [="load"] The event name to bind resolve to.
 * @param {string} rejectEventName [="error"] The event name to bind reject to.
function bindEvents(element, resolveEventName, rejectEventName) {
  element.eventPromise =
      bindEvents2(element, resolveEventName, element, rejectEventName);
}
function bindEvents2(resolveObject, resolveEventName, rejectObject, rejectEventName, rejectObject2, rejectEventName2) {
  return new Promise(function(resolve, reject) {
    const actualResolveEventName = resolveEventName || "load";
    const actualRejectEventName = rejectEventName || "error";
    const actualRejectEventName2 = rejectEventName2 || "error";
    const resolveHandler = function(event) {
      cleanup();
      resolve(event);
    };
    const rejectHandler = function(event) {
      event.preventDefault();
      cleanup();
      reject(event);
    };
    const cleanup = function() {
      resolveObject.removeEventListener(actualResolveEventName, resolveHandler);
      rejectObject.removeEventListener(actualRejectEventName, rejectHandler);
      if (rejectObject2) {
        rejectObject2.removeEventListener(actualRejectEventName2, rejectHandler);
      }
    };
    resolveObject.addEventListener(actualResolveEventName, resolveHandler);
    rejectObject.addEventListener(actualRejectEventName, rejectHandler);
    if (rejectObject2) {
      rejectObject2.addEventListener(actualRejectEventName2, rejectHandler);
    }
  });
}
 * Creates a new DOM element.
 * @param {string} tagName The type of the DOM element.
 * @param {object} attrs A JSON with attributes to apply to the element.
 * @param {DOMElement} parent Optional - an existing DOM element to append to
 *     If not provided, the returned element will remain orphaned.
 * @param {boolean} doBindEvents Optional - Whether to bind to load and error
 *     events and provide the promise wrapping the events via the element's
 *     {@code eventPromise} property. Default value evaluates to false.
 * @return {DOMElement} The newly created DOM element.
function createElement(tagName, attrs, parentNode, doBindEvents) {
  var element = document.createElement(tagName);
  if (doBindEvents) {
    bindEvents(element);
    if (element.tagName == "IFRAME" && !('srcdoc' in attrs || 'src' in attrs)) {
      element.eventPromise = element.eventPromise.then(() => {
        return new Promise(resolve => setTimeout(resolve, 0))
      });
    }
  }
  var isImg = (tagName == "img");
  if (!isImg)
    setAttributes(element, attrs);
  if (parentNode)
    parentNode.appendChild(element);
  if (isImg)
    setAttributes(element, attrs);
  return element;
}
function createRequestViaElement(tagName, attrs, parentNode) {
  return createElement(tagName, attrs, parentNode, true).eventPromise;
}
function wrapResult(server_data) {
  if (typeof(server_data) === "string") {
    throw server_data;
  }
  return {
    referrer: server_data.headers.referer,
    headers: server_data.headers
  }
}
  @typedef RequestResult
  @type {object}
  Represents the result of sending an request.
  All properties are optional. See the comments for
  requestVia*() and invokeRequest() below to see which properties are set.
  @property {Array<Object<string, string>>} headers
    HTTP request headers sent to server.
  @property {string} referrer - Referrer.
  @property {string} location - The URL of the subresource.
  @property {string} sourceContextUrl
    the URL of the global object where the actual request is sent.
  requestVia*(url, additionalAttributes) functions send a subresource
  request from the current environment settings object.
  @param {string} url
    The URL of the subresource.
  @param {Object<string, string>} additionalAttributes
    Additional attributes set to DOM elements
    (element-initiated requests only).
  @returns {Promise} that are resolved with a RequestResult object
  on successful requests.
  - Category 1:
      `headers`: set.
      `referrer`: set via `document.referrer`.
      `location`: set via `document.location`.
  - Category 2:
      `headers`: set.
      `referrer`: set to `headers.referer` by `wrapResult()`.
      `location`: not set.
  - Category 3:
      All the keys listed above are NOT set.
  `sourceContextUrl` is not set here.
  -------------------------------- -------- --------------------------
  Function name                    Category Used in
                                            -------- ------- ---------
                                            referrer mixed-  upgrade-
                                            policy   content insecure-
                                            policy   content request
  -------------------------------- -------- -------- ------- ---------
  requestViaAnchor                 1        Y        Y       -
  requestViaArea                   1        Y        Y       -
  requestViaAudio                  3        -        Y       -
  requestViaDedicatedWorker        2        Y        Y       Y
  requestViaFetch                  2        Y        Y       -
  requestViaForm                   2        -        Y       -
  requestViaIframe                 1        Y        Y       -
  requestViaImage                  2        Y        Y       -
  requestViaLinkPrefetch           3        -        Y       -
  requestViaLinkStylesheet         3        -        Y       -
  requestViaObject                 3        -        Y       -
  requestViaPicture                3        -        Y       -
  requestViaScript                 2        Y        Y       -
  requestViaSendBeacon             3        -        Y       -
  requestViaSharedWorker           2        Y        Y       Y
  requestViaVideo                  3        -        Y       -
  requestViaWebSocket              3        -        Y       -
  requestViaWorklet                3        -        Y       Y
  requestViaXhr                    2        Y        Y       -
  -------------------------------- -------- -------- ------- ---------
 * Creates a new iframe, binds load and error events, sets the src attribute and
 *     appends it to {@code document.body} .
 * @param {string} url The src for the iframe.
function requestViaIframe(url, additionalAttributes) {
  const iframe = createElement(
      "iframe",
      Object.assign({"src": url}, additionalAttributes),
      document.body,
      false);
  return bindEvents2(window, "message", iframe, "error", window, "error")
      .then(event => {
          if (event.source !== iframe.contentWindow)
            return Promise.reject(new Error('Unexpected event.source'));
          return event.data;
        });
}
 * Creates a new image, binds load and error events, sets the src attribute and
 *     appends it to {@code document.body} .
 * @param {string} url The src for the image.
function requestViaImage(url, additionalAttributes) {
  const img = createElement(
      "img",
      Object.assign({"src": url, "crossOrigin": "Anonymous"}, additionalAttributes),
      document.body, true);
  return img.eventPromise.then(() => wrapResult(decodeImageData(img)));
}
function decodeImageData(img) {
  var canvas = document.createElement("canvas");
  var context = canvas.getContext('2d');
  context.drawImage(img, 0, 0);
  var imgData = context.getImageData(0, 0, img.clientWidth, img.clientHeight);
  const rgba = imgData.data;
  let decodedBytes = new Uint8ClampedArray(rgba.length);
  let decodedLength = 0;
  for (var i = 0; i + 12 <= rgba.length; i += 12) {
    const bits = [];
    for (let j = 0; j < 3; ++j) {
      bits.push(rgba[i + j * 4 + 0]);
      bits.push(rgba[i + j * 4 + 1]);
      bits.push(rgba[i + j * 4 + 2]);
    }
    bits.pop();
    let byte = 0;
    for (let j = 0; j < 8; ++j) {
      byte <<= 1;
      if (bits[j] >= 128)
        byte |= 1;
    }
    if (byte == 0)
      break;
    decodedBytes[decodedLength++] = byte;
  }
  decodedBytes = decodedBytes.subarray(0, decodedLength);
  var string_data = (new TextDecoder("ascii")).decode(decodedBytes);
  return JSON.parse(string_data);
}
 * Initiates a new XHR GET request to provided URL.
 * @param {string} url The endpoint URL for the XHR.
function requestViaXhr(url) {
  return xhrRequest(url).then(result => wrapResult(result));
}
 * Initiates a new GET request to provided URL via the Fetch API.
 * @param {string} url The endpoint URL for the Fetch.
function requestViaFetch(url) {
  return fetch(url)
    .then(res => res.json())
    .then(j => wrapResult(j));
}
function dedicatedWorkerUrlThatFetches(url) {
    fetch('${url}')
      .then(r => r.json())
      .then(j => postMessage(j))
      .catch((e) => postMessage(e.message));`;
}
function workerUrlThatImports(url) {
      `?import_url=${encodeURIComponent(url)}`;
}
function workerDataUrlThatImports(url) {
}
 * Creates a new Worker, binds message and error events wrapping them into.
 *     {@code worker.eventPromise} and posts an empty string message to start
 *     the worker.
 * @param {string} url The endpoint URL for the worker script.
 * @param {object} options The options for Worker constructor.
function requestViaDedicatedWorker(url, options) {
  var worker;
  try {
    worker = new Worker(url, options);
  } catch (e) {
    return Promise.reject(e);
  }
  worker.postMessage('');
  return bindEvents2(worker, "message", worker, "error")
    .then(event => wrapResult(event.data));
}
function requestViaSharedWorker(url, options) {
  var worker;
  try {
    worker = new SharedWorker(url, options);
  } catch(e) {
    return Promise.reject(e);
  }
  const promise = bindEvents2(worker.port, "message", worker, "error")
    .then(event => wrapResult(event.data));
  worker.port.start();
  return promise;
}
function get_worklet(type) {
  if (type == 'animation')
    return CSS.animationWorklet;
  if (type == 'layout')
    return CSS.layoutWorklet;
  if (type == 'paint')
    return CSS.paintWorklet;
  if (type == 'audio')
    return new OfflineAudioContext(2,44100*40,44100).audioWorklet;
  throw new Error('unknown worklet type is passed.');
}
function requestViaWorklet(type, url) {
  try {
    return get_worklet(type).addModule(url);
  } catch (e) {
    return Promise.reject(e);
  }
}
 * Creates a navigable element with the name `navigableElementName`
 * (<a>, <area>, or <form>) under `parentNode`, and
 * performs a navigation by `trigger()` (e.g. clicking <a>).
 * To avoid navigating away from the current execution context,
 * a target attribute is set to point to a new helper iframe.
 * @param {string} navigableElementName
 * @param {object} additionalAttributes The attributes of the navigable element.
 * @param {DOMElement} parentNode
 * @param {function(DOMElement} trigger A callback called after the navigable
 * element is inserted and should trigger navigation using the element.
function requestViaNavigable(navigableElementName, additionalAttributes,
                             parentNode, trigger) {
  const name = guid();
  const iframe =
    createElement("iframe", {"name": name, "id": name}, parentNode, false);
  const navigable = createElement(
      navigableElementName,
      Object.assign({"target": name}, additionalAttributes),
      parentNode, false);
  const promise =
    bindEvents2(window, "message", iframe, "error", window, "error")
      .then(event => {
          if (event.source !== iframe.contentWindow)
            return Promise.reject(new Error('Unexpected event.source'));
          return event.data;
        });
  trigger(navigable);
  return promise;
}
 * Creates a new anchor element, appends it to {@code document.body} and
 *     performs the navigation.
 * @param {string} url The URL to navigate to.
function requestViaAnchor(url, additionalAttributes) {
  return requestViaNavigable(
      "a",
      Object.assign({"href": url, "innerHTML": "Link to resource"},
                    additionalAttributes),
      document.body, a => a.click());
}
 * Creates a new area element, appends it to {@code document.body} and performs
 *     the navigation.
 * @param {string} url The URL to navigate to.
function requestViaArea(url, additionalAttributes) {
  return requestViaNavigable(
      "area",
      Object.assign({"href": url}, additionalAttributes),
      document.body, area => area.click());
}
 * Creates a new script element, sets the src to url, and appends it to
 *     {@code document.body}.
 * @param {string} url The src URL.
function requestViaScript(url, additionalAttributes) {
  const script = createElement(
      "script",
      Object.assign({"src": url}, additionalAttributes),
      document.body,
      false);
  return bindEvents2(window, "message", script, "error", window, "error")
    .then(event => wrapResult(event.data));
}
 * Creates a new form element, sets attributes, appends it to
 *     {@code document.body} and submits the form.
 * @param {string} url The URL to submit to.
function requestViaForm(url, additionalAttributes) {
  return requestViaNavigable(
      "form",
      Object.assign({"action": url, "method": "POST"}, additionalAttributes),
      document.body, form => form.submit());
}
 * Creates a new link element for a stylesheet, binds load and error events,
 *     sets the href to url and appends it to {@code document.head}.
 * @param {string} url The URL for a stylesheet.
function requestViaLinkStylesheet(url) {
  return createRequestViaElement("link",
                                 {"rel": "stylesheet", "href": url},
                                 document.head);
}
 * Creates a new link element for a prefetch, binds load and error events, sets
 *     the href to url and appends it to {@code document.head}.
 * @param {string} url The URL of a resource to prefetch.
function requestViaLinkPrefetch(url) {
  var link = document.createElement('link');
  if (link.relList && link.relList.supports && link.relList.supports("prefetch")) {
    return createRequestViaElement("link",
                                   {"rel": "prefetch", "href": url},
                                   document.head);
  } else {
    return Promise.reject("This browser does not support 'prefetch'.");
  }
}
 * Initiates a new beacon request.
 * @param {string} url The URL of a resource to prefetch.
async function requestViaSendBeacon(url) {
  function wait(ms) {
    return new Promise(resolve => step_timeout(resolve, ms));
  }
  if (!navigator.sendBeacon(url)) {
    throw new Error('sendBeacon() fails.');
  }
  await wait(500);
  return 'allowed';
}
 * Creates a new media element with a child source element, binds loadeddata and
 *     error events, sets attributes and appends to document.body.
 * @param {object} media_attrs The attributes for the media element.
 * @param {object} source_attrs The attributes for the child source element.
 * @return {DOMElement} The newly created media element.
function createMediaElement(type, media_attrs, source_attrs) {
  var mediaElement = createElement(type, {});
  var sourceElement = createElement("source", {});
  mediaElement.eventPromise = new Promise(function(resolve, reject) {
    mediaElement.addEventListener("loadeddata", function (e) {
      resolve(e);
    });
    mediaElement.addEventListener("stalled", function(e) {
      reject(e);
    });
    sourceElement.addEventListener("error", function(e) {
      reject(e);
    });
  });
  setAttributes(mediaElement, media_attrs);
  setAttributes(sourceElement, source_attrs);
  mediaElement.appendChild(sourceElement);
  document.body.appendChild(mediaElement);
  return mediaElement;
}
 * Creates a new video element, binds loadeddata and error events, sets
 *     attributes and source URL and appends to {@code document.body}.
 * @param {string} url The URL of the video.
function requestViaVideo(url) {
  return createMediaElement("video",
                            {},
                            {"src": url}).eventPromise;
}
 * Creates a new audio element, binds loadeddata and error events, sets
 *     attributes and source URL and appends to {@code document.body}.
 * @param {string} url The URL of the audio.
function requestViaAudio(url) {
  return createMediaElement("audio",
                            {},
}
 * Creates a new picture element, binds loadeddata and error events, sets
 *     attributes and source URL and appends to {@code document.body}. Also
 *     creates new image element appending it to the picture
 * @param {string} url The URL of the image for the source and image elements.
function requestViaPicture(url) {
  var picture = createMediaElement("picture", {}, {"srcset": url,
  return createRequestViaElement("img", {"src": url}, picture);
}
 * Creates a new object element, binds load and error events, sets the data to
 *     url, and appends it to {@code document.body}.
 * @param {string} url The data URL.
function requestViaObject(url) {
}
 * Creates a new WebSocket pointing to {@code url} and sends a message string
 * "echo". The {@code message} and {@code error} events are triggering the
 * @param {string} url The URL for WebSocket to connect to.
function requestViaWebSocket(url) {
  return new Promise(function(resolve, reject) {
    var websocket = new WebSocket(url);
    websocket.addEventListener("message", function(e) {
      resolve(e.data);
    });
    websocket.addEventListener("open", function(e) {
      websocket.send("echo");
    });
    websocket.addEventListener("error", function(e) {
      reject(e)
    });
  })
  .then(data => {
      return JSON.parse(data);
    });
}
  @typedef SubresourceType
  @type {string}
  Represents how a subresource is sent.
  The keys of `subresourceMap` below are the valid values.
const subresourceMap = {
  "a-tag": {
    invoker: requestViaAnchor,
  },
  "area-tag": {
    invoker: requestViaArea,
  },
  "audio-tag": {
    invoker: requestViaAudio,
  },
  "beacon": {
    invoker: requestViaSendBeacon,
  },
  "fetch": {
    invoker: requestViaFetch,
  },
  "form-tag": {
    invoker: requestViaForm,
  },
  "iframe-tag": {
    invoker: requestViaIframe,
  },
  "img-tag": {
    invoker: requestViaImage,
  },
  "link-css-tag": {
    invoker: requestViaLinkStylesheet,
  },
  "link-prefetch-tag": {
    invoker: requestViaLinkPrefetch,
  },
  "object-tag": {
    invoker: requestViaObject,
  },
  "picture-tag": {
    invoker: requestViaPicture,
  },
  "script-tag": {
    invoker: requestViaScript,
  },
  "video-tag": {
    invoker: requestViaVideo,
  },
  "xhr": {
    invoker: requestViaXhr,
  },
  "worker-classic": {
    invoker: url => requestViaDedicatedWorker(url),
  },
  "worker-module": {
    invoker: url => requestViaDedicatedWorker(url, {type: "module"}),
  },
  "worker-import": {
    invoker: url =>
        requestViaDedicatedWorker(workerUrlThatImports(url), {type: "module"}),
  },
  "worker-import-data": {
    invoker: url =>
        requestViaDedicatedWorker(workerDataUrlThatImports(url), {type: "module"}),
  },
  "sharedworker-classic": {
    invoker: url => requestViaSharedWorker(url),
  },
  "sharedworker-module": {
    invoker: url => requestViaSharedWorker(url, {type: "module"}),
  },
  "sharedworker-import": {
    invoker: url =>
        requestViaSharedWorker(workerUrlThatImports(url), {type: "module"}),
  },
  "sharedworker-import-data": {
    invoker: url =>
        requestViaSharedWorker(workerDataUrlThatImports(url), {type: "module"}),
  },
  "websocket": {
    invoker: requestViaWebSocket,
  },
};
for (const workletType of ['animation', 'audio', 'layout', 'paint']) {
  subresourceMap[`worklet-${workletType}`] = {
      invoker: url => requestViaWorklet(workletType, url)
    };
  subresourceMap[`worklet-${workletType}-import-data`] = {
      invoker: url =>
          requestViaWorklet(workletType, workerDataUrlThatImports(url))
    };
}
  @typedef RedirectionType
  @type {string}
  Represents what redirects should occur to the subresource request
  after initial request.
  See preprocess_redirection() in
  Construct subresource (and related) origin.
  @param {string} originType
  @returns {object} the origin of the subresource.
function getSubresourceOrigin(originType) {
  const httpProtocol = "http";
  const httpsProtocol = "https";
  const wsProtocol = "ws";
  const wssProtocol = "wss";
  const sameOriginHost = "{{host}}";
  const crossOriginHost = "{{domains[www1]}}";
  const httpPort = getNormalizedPort(parseInt("{{ports[http][0]}}", 10));
  const httpsRawPort = parseInt("{{ports[https][0]}}", 10);
  const httpsPort = getNormalizedPort(httpsRawPort);
  const wsPort = getNormalizedPort(parseInt("{{ports[ws][0]}}", 10));
  const wssRawPort = parseInt("{{ports[wss][0]}}", 10);
  const wssPort = getNormalizedPort(wssRawPort);
    @typedef OriginType
    @type {string}
    Represents the origin of the subresource request URL.
    The keys of `originMap` below are the valid values.
    Note that there can be redirects from the specified origin
    (see RedirectionType), and thus the origin of the subresource
    response URL might be different from what is specified by OriginType.
  const originMap = {
    "same-http-downgrade":
    "cross-http-downgrade":
    "same-ws-downgrade":
    "cross-ws-downgrade":
  };
  return originMap[originType];
}
  Construct subresource (and related) URLs.
  @param {SubresourceType} subresourceType
  @param {OriginType} originType
  @param {RedirectionType} redirectionType
  @returns {object} with following properties:
    {string} testUrl
      The subresource request URL.
    {string} announceUrl
    {string} assertUrl
      The URLs to be used for detecting whether `testUrl` is actually sent
      to the server.
      1. Fetch `announceUrl` first,
      2. then possibly fetch `testUrl`, and
      3. finally fetch `assertUrl`.
         The fetch result of `assertUrl` should indicate whether
         `testUrl` is actually sent to the server or not.
function getRequestURLs(subresourceType, originType, redirectionType) {
  const key = guid();
  const value = guid();
                        key + "&path=" + stashPath;
  return {
    testUrl:
      getSubresourceOrigin(originType) +
        subresourceMap[subresourceType].path +
        "?redirection=" + encodeURIComponent(redirectionType) +
        "&action=purge&key=" + key +
        "&path=" + stashPath,
    announceUrl: stashEndpoint + "&action=put&value=" + value,
    assertUrl: stashEndpoint + "&action=take",
  };
}
  invokeRequest() invokes a subresource request
  (specified as `subresource`)
  from a (possibly nested) environment settings object
  (specified as `sourceContextList`).
  For nested contexts, invokeRequest() calls an invokeFrom*() function
  that creates a nested environment settings object using
  again inside the nested environment settings object.
  This cycle continues until all specified
  nested environment settings object are created, and
  finally invokeRequest() calls a requestVia*() function to start the
  subresource request from the inner-most environment settings object.
  @param {Subresource} subresource
  @param {Array<SourceContext>} sourceContextList
  @returns {Promise} A promise that is resolved with an RequestResult object.
  `sourceContextUrl` is always set. For whether other properties are set,
  see the comments for requestVia*() above.
function invokeRequest(subresource, sourceContextList) {
  if (sourceContextList.length === 0) {
    const additionalAttributes = {};
    for (const policyDelivery of (subresource.policyDeliveries || [])) {
      if (policyDelivery.deliveryType === "attr") {
        additionalAttributes[policyDelivery.key] = policyDelivery.value;
      } else if (policyDelivery.deliveryType === "rel-noref") {
        additionalAttributes["rel"] = "noreferrer";
      }
    }
    return subresourceMap[subresource.subresourceType].invoker(
        subresource.url,
        additionalAttributes)
      .then(result => Object.assign(
          {sourceContextUrl: location.toString()},
          result));
  }
  const sourceContextMap = {
      invoker: invokeFromIframe,
    },
      invoker: invokeFromIframe,
    },
      invoker: invokeFromIframe,
    },
    "worker-classic": {
      invoker: invokeFromWorker.bind(undefined, "worker", false, {}),
    },
    "worker-classic-data": {
      invoker: invokeFromWorker.bind(undefined, "worker", true, {}),
    },
    "worker-module": {
      invoker: invokeFromWorker.bind(undefined, "worker", false, {type: 'module'}),
    },
    "worker-module-data": {
      invoker: invokeFromWorker.bind(undefined, "worker", true, {type: 'module'}),
    },
    "sharedworker-classic": {
      invoker: invokeFromWorker.bind(undefined, "sharedworker", false, {}),
    },
    "sharedworker-classic-data": {
      invoker: invokeFromWorker.bind(undefined, "sharedworker", true, {}),
    },
    "sharedworker-module": {
      invoker: invokeFromWorker.bind(undefined, "sharedworker", false, {type: 'module'}),
    },
    "sharedworker-module-data": {
      invoker: invokeFromWorker.bind(undefined, "sharedworker", true, {type: 'module'}),
    },
  };
  return sourceContextMap[sourceContextList[0].sourceContextType].invoker(
      subresource, sourceContextList);
}
self.invokeRequest = invokeRequest;
  invokeFrom*() functions are helper functions with the same parameters
  and return values as invokeRequest(), that are tied to specific types
  of top-most environment settings objects.
  For example, invokeFromIframe() is the helper function for the cases where
  sourceContextList[0] is an iframe.
  @param {string} workerType
    "worker" (for dedicated worker) or "sharedworker".
  @param {boolean} isDataUrl
    true if the worker script is loaded from data: URL.
    Otherwise, the script is loaded from same-origin.
  @param {object} workerOptions
    The `options` argument for Worker constructor.
  Other parameters and return values are the same as those of invokeRequest().
function invokeFromWorker(workerType, isDataUrl, workerOptions,
                          subresource, sourceContextList) {
  const currentSourceContext = sourceContextList[0];
  let workerUrl =
    encodeURIComponent(JSON.stringify(
        currentSourceContext.policyDeliveries || []));
  if (workerOptions.type === 'module') {
    workerUrl += "&type=module";
  }
  let promise;
  if (isDataUrl) {
    promise = fetch(workerUrl)
      .then(r => r.text())
      .then(source => {
        });
  } else {
    promise = Promise.resolve(workerUrl);
  }
  return promise
    .then(url => {
      if (workerType === "worker") {
        const worker = new Worker(url, workerOptions);
        worker.postMessage({subresource: subresource,
                            sourceContextList: sourceContextList.slice(1)});
        return bindEvents2(worker, "message", worker, "error", window, "error");
      } else if (workerType === "sharedworker") {
        const worker = new SharedWorker(url, workerOptions);
        worker.port.start();
        worker.port.postMessage({subresource: subresource,
                                 sourceContextList: sourceContextList.slice(1)});
        return bindEvents2(worker.port, "message", worker, "error", window, "error");
      } else {
        throw new Error('Invalid worker type: ' + workerType);
      }
    })
    .then(event => {
        if (event.data.error)
          return Promise.reject(event.data.error);
        return event.data;
      });
}
function invokeFromIframe(subresource, sourceContextList) {
  const currentSourceContext = sourceContextList[0];
  const frameUrl =
    encodeURIComponent(JSON.stringify(
        currentSourceContext.policyDeliveries || []));
  let iframe;
  let promise;
  if (currentSourceContext.sourceContextType === 'srcdoc') {
    promise = fetch(frameUrl)
      .then(r => r.text())
      .then(srcdoc => {
          iframe = createElement(
              "iframe", {srcdoc: srcdoc}, document.body, true);
          return iframe.eventPromise;
        });
  } else if (currentSourceContext.sourceContextType === 'iframe') {
    iframe = createElement("iframe", {src: frameUrl}, document.body, true);
    promise = iframe.eventPromise;
  } else if (currentSourceContext.sourceContextType === 'iframe-blank') {
    let frameContent;
    promise = fetch(frameUrl)
      .then(r => r.text())
      .then(t => {
          frameContent = t;
          iframe = createElement("iframe", {}, document.body, true);
          return iframe.eventPromise;
        })
      .then(() => {
          bindEvents(iframe);
          iframe.contentDocument.write(frameContent);
          iframe.contentDocument.close();
          return iframe.eventPromise;
        });
  }
  return promise
    .then(() => {
        const promise = bindEvents2(
            window, "message", iframe, "error", window, "error");
        iframe.contentWindow.postMessage(
            {subresource: subresource,
             sourceContextList: sourceContextList.slice(1)},
            "*");
        return promise;
      })
    .then(event => {
        if (event.data.error)
          return Promise.reject(event.data.error);
        return event.data;
      });
}
function SanityChecker() {}
SanityChecker.prototype.checkScenario = function() {};
SanityChecker.prototype.setFailTimeout = function(test, timeout) {};
SanityChecker.prototype.checkSubresourceResult = function() {};
