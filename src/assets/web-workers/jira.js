/******/
(function(modules) { // webpackBootstrap
  /******/ 	// The module cache
  /******/
  var installedModules = {};
  /******/
  /******/ 	// The require function
  /******/
  function __webpack_require__(moduleId) {
    /******/
    /******/ 		// Check if module is in cache
    /******/
    if (installedModules[moduleId]) {
      /******/
      return installedModules[moduleId].exports;
      /******/
    }
    /******/ 		// Create a new module (and put it into the cache)
    /******/
    var module = installedModules[moduleId] = {
      /******/      i: moduleId,
      /******/      l: false,
      /******/      exports: {}
      /******/
    };
    /******/
    /******/ 		// Execute the module function
    /******/
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    /******/
    /******/ 		// Flag the module as loaded
    /******/
    module.l = true;
    /******/
    /******/ 		// Return the exports of the module
    /******/
    return module.exports;
    /******/
  }

  /******/
  /******/
  /******/ 	// expose the modules object (__webpack_modules__)
  /******/
  __webpack_require__.m = modules;
  /******/
  /******/ 	// expose the module cache
  /******/
  __webpack_require__.c = installedModules;
  /******/
  /******/ 	// define getter function for harmony exports
  /******/
  __webpack_require__.d = function(exports, name, getter) {
    /******/
    if (!__webpack_require__.o(exports, name)) {
      /******/
      Object.defineProperty(exports, name, {
        /******/        configurable: false,
        /******/        enumerable: true,
        /******/        get: getter
        /******/
      });
      /******/
    }
    /******/
  };
  /******/
  /******/ 	// getDefaultExport function for compatibility with non-harmony modules
  /******/
  __webpack_require__.n = function(module) {
    /******/
    var getter = module && module.__esModule ?
      /******/      function getDefault() {
        return module['default'];
      } :
      /******/      function getModuleExports() {
        return module;
      };
    /******/
    __webpack_require__.d(getter, 'a', getter);
    /******/
    return getter;
    /******/
  };
  /******/
  /******/ 	// Object.prototype.hasOwnProperty.call
  /******/
  __webpack_require__.o = function(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  };
  /******/
  /******/ 	// __webpack_public_path__
  /******/
  __webpack_require__.p = "";
  /******/
  /******/ 	// Load entry module and return exports
  /******/
  return __webpack_require__(__webpack_require__.s = 9);
  /******/
})
/************************************************************************/
/******/([
  /* 0 */,
  /* 1 */,
  /* 2 */
  /***/ (function(module, exports) {

    module.exports = isFunction

    var toString = Object.prototype.toString

    function isFunction(fn) {
      var string = toString.call(fn)
      return string === '[object Function]' ||
        (typeof fn === 'function' && string !== '[object RegExp]') ||
        (typeof window !== 'undefined' &&
          // IE8 and below
          (fn === window.setTimeout ||
            fn === window.alert ||
            fn === window.confirm ||
            fn === window.prompt))
    };

    /***/
  }),
  /* 3 */,
  /* 4 */,
  /* 5 */,
  /* 6 */,
  /* 7 */,
  /* 8 */,
  /* 9 */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    /* harmony import */
    var __WEBPACK_IMPORTED_MODULE_0__jira__ = __webpack_require__(10);
// import '../img/icon_32x32.png'
// import '../img/icon_128x128.png'
// import { IS_DEV } from 'cfg';

// import { IdleHandler } from './idle-handler';

// let isInterfaceInitialized = false;

    const jira = new __WEBPACK_IMPORTED_MODULE_0__jira__["a" /* JiraApiWrapper */]();
    self.onmessage = function(msg) {
      console.log(msg);
      jira.execRequest(msg.data).then((res) => {
        console.log(`SPEX:background:jira.execRequest:${request.apiMethod}:Response:`, res);
        self.postMessage(res);
      });
    };


    /***/
  }),
  /* 10 */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {

    "use strict";
    /* harmony import */
    var __WEBPACK_IMPORTED_MODULE_0_xhr__ = __webpack_require__(11);
    /* harmony import */
    var __WEBPACK_IMPORTED_MODULE_0_xhr___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_xhr__);

    class JiraApiWrapper {
      constructor() {
        this.xhr = __WEBPACK_IMPORTED_MODULE_0_xhr___default.a;
      }

      isConfigSufficient(config) {
        if (!config) {
          throw 'SPEX:JiraApiWrapper: No request config.';
        } else if (!config.isJiraEnabled) {
          throw 'SPEX:JiraApiWrapper: Jira not enabled.';
        } else if (!config.host) {
          throw 'SPEX:JiraApiWrapper: Host not configured.';
        } else {
          return true;
        }
      }

      execRequest(request) {
        console.log(`SPEX:JiraApiWrapper:Request:${request.apiMethod}`, request);

        if (!this.isConfigSufficient(request.config)) {
          return;
        }

        if (request.apiMethod && this[request.apiMethod]) {
          return this[request.apiMethod](request);
        } else {
          throw new Error('SPEX:JiraApiWrapper: invalid request ' + request.apiMethod);
        }
      }

      _b64EncodeUnicode(str) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
          function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
          }));
      }

      doRequest(orgRequest, request) {
        const encoded = this._b64EncodeUnicode(`${orgRequest.config.userName}:${orgRequest.config.password}`);
        const queryStr = request.query ? `?${this.queryStringParser(request.query)}` : '';
        const base = `${orgRequest.config.host}/rest/api/latest`;
        // cleanup just in case
        const uri = `${base}/${request.pathname}${queryStr}`.trim().replace('//', '/');

        return new Promise((resolve) => {

          this.xhr({
            uri: uri,
            method: request.method || 'GET',
            body: JSON.stringify(request.body),
            headers: {
              'authorization': `Basic ${encoded}`,
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          }, function(err, res, body) {
            if (err) {
              resolve({
                error: err,
                requestId: orgRequest.requestId
              });
            } else if (res.statusCode >= 300) {
              resolve({
                error: res.statusCode,
                requestId: orgRequest.requestId
              });
            } else if (body) {
              const parsed = JSON.parse(body);

              const err = parsed.errorMessages || parsed.errors;
              if (err) {
                resolve({
                  error: err,
                  requestId: orgRequest.requestId
                });
              } else {
                resolve({
                  response: parsed,
                  requestId: orgRequest.requestId
                });
              }
            } else if (!body) {
              resolve({
                response: null,
                requestId: orgRequest.requestId
              });
            }
          });
        });
      }

      searchJira(orgRequest) {
        const optional = orgRequest.arguments.length > 1 && orgRequest.arguments[1] !== undefined ? orgRequest.arguments[1] : {};

        return this.doRequest(orgRequest, {
          pathname: 'search',
          method: 'POST',
          body: Object.assign(optional, {
            jql: orgRequest.arguments[0]
          }),
        });
      }

      addWorklog(orgRequest) {
        const issueId = orgRequest.arguments[0];
        const worklog = orgRequest.arguments[1];

        return this.doRequest(orgRequest, {
          pathname: `issue/${issueId}/worklog`,
          method: 'POST',
          body: worklog,
        });
      }

      searchUsers(orgRequest) {
        const username = orgRequest.arguments[0].username;
        const startAt = orgRequest.arguments[0].startAt;
        const maxResults = orgRequest.arguments[0].maxResults;
        const includeActive = orgRequest.arguments[0].includeActive;
        const includeInactive = orgRequest.arguments[0].includeInactive;

        return this.doRequest(orgRequest, {
          pathname: 'user/search',
          method: 'GET',
          query: {
            username: username,
            startAt: startAt || 0,
            maxResults: maxResults || 50,
            includeActive: includeActive || true,
            includeInactive: includeInactive || false
          }
        });
      }

      listTransitions(orgRequest) {
        const issueId = orgRequest.arguments[0];

        return this.doRequest(orgRequest, {
          pathname: `issue/${issueId}/transitions`,
          method: 'GET',
          query: {
            expand: 'transitions.fields'
          }
        });
      }

      updateIssue(orgRequest) {
        const issueId = orgRequest.arguments[0];
        const issueUpdate = orgRequest.arguments[1];

        return this.doRequest(orgRequest, {
          pathname: `issue/${issueId}`,
          method: 'PUT',
          body: issueUpdate,
        });
      }

      findIssue(orgRequest) {
        const issueId = orgRequest.arguments[0];
        const expandParam = orgRequest.arguments[1];

        return this.doRequest(orgRequest, {
          pathname: `issue/${issueId}`,
          method: 'GET',
          query: {
            expand: expandParam || ''
          }
        });
      }

      transitionIssue(orgRequest) {
        const issueId = orgRequest.arguments[0];
        const issueTransition = orgRequest.arguments[1];

        return this.doRequest(orgRequest, {
          pathname: `issue/${issueId}/transitions`,
          method: 'POST',
          body: issueTransition
        });
      }

      listStatus(orgRequest) {
        return this.doRequest(orgRequest, {
          pathname: `status`,
          method: 'GET',
        });
      }

      getCurrentUser(orgRequest) {
        return this.doRequest(orgRequest, {
          pathname: `myself`,
          method: 'GET',
        });
      }
    }

    /* harmony export (immutable) */
    __webpack_exports__["a"] = JiraApiWrapper;

    /***/
  }),
  /* 11 */
  /***/ (function(module, exports, __webpack_require__) {

    "use strict";

    var window = __webpack_require__(12)
    var isFunction = __webpack_require__(2)
    var parseHeaders = __webpack_require__(14)
    var xtend = __webpack_require__(17)

    module.exports = createXHR
    createXHR.XMLHttpRequest = window.XMLHttpRequest || noop
    createXHR.XDomainRequest = "withCredentials" in (new createXHR.XMLHttpRequest()) ? createXHR.XMLHttpRequest : window.XDomainRequest

    forEachArray(["get", "put", "post", "patch", "head", "delete"], function(method) {
      createXHR[method === "delete" ? "del" : method] = function(uri, options, callback) {
        options = initParams(uri, options, callback)
        options.method = method.toUpperCase()
        return _createXHR(options)
      }
    })

    function forEachArray(array, iterator) {
      for (var i = 0; i < array.length; i++) {
        iterator(array[i])
      }
    }

    function isEmpty(obj) {
      for (var i in obj) {
        if (obj.hasOwnProperty(i)) return false
      }
      return true
    }

    function initParams(uri, options, callback) {
      var params = uri

      if (isFunction(options)) {
        callback = options
        if (typeof uri === "string") {
          params = { uri: uri }
        }
      } else {
        params = xtend(options, { uri: uri })
      }

      params.callback = callback
      return params
    }

    function createXHR(uri, options, callback) {
      options = initParams(uri, options, callback)
      return _createXHR(options)
    }

    function _createXHR(options) {
      if (typeof options.callback === "undefined") {
        throw new Error("callback argument missing")
      }

      var called = false
      var callback = function cbOnce(err, response, body) {
        if (!called) {
          called = true
          options.callback(err, response, body)
        }
      }

      function readystatechange() {
        if (xhr.readyState === 4) {
          setTimeout(loadFunc, 0)
        }
      }

      function getBody() {
        // Chrome with requestType=blob throws errors arround when even testing access to responseText
        var body = undefined

        if (xhr.response) {
          body = xhr.response
        } else {
          body = xhr.responseText || getXml(xhr)
        }

        if (isJson) {
          try {
            body = JSON.parse(body)
          } catch (e) {
          }
        }

        return body
      }

      function errorFunc(evt) {
        clearTimeout(timeoutTimer)
        if (!(evt instanceof Error)) {
          evt = new Error("" + (evt || "Unknown XMLHttpRequest Error"))
        }
        evt.statusCode = 0
        return callback(evt, failureResponse)
      }

      // will load the data & process the response in a special response object
      function loadFunc() {
        if (aborted) return
        var status
        clearTimeout(timeoutTimer)
        if (options.useXDR && xhr.status === undefined) {
          //IE8 CORS GET successful response doesn't have a status field, but body is fine
          status = 200
        } else {
          status = (xhr.status === 1223 ? 204 : xhr.status)
        }
        var response = failureResponse
        var err = null

        if (status !== 0) {
          response = {
            body: getBody(),
            statusCode: status,
            method: method,
            headers: {},
            url: uri,
            rawRequest: xhr
          }
          if (xhr.getAllResponseHeaders) { //remember xhr can in fact be XDR for CORS in IE
            response.headers = parseHeaders(xhr.getAllResponseHeaders())
          }
        } else {
          err = new Error("Internal XMLHttpRequest Error")
        }
        return callback(err, response, response.body)
      }

      var xhr = options.xhr || null

      if (!xhr) {
        if (options.cors || options.useXDR) {
          xhr = new createXHR.XDomainRequest()
        } else {
          xhr = new createXHR.XMLHttpRequest()
        }
      }

      var key
      var aborted
      var uri = xhr.url = options.uri || options.url
      var method = xhr.method = options.method || "GET"
      var body = options.body || options.data
      var headers = xhr.headers = options.headers || {}
      var sync = !!options.sync
      var isJson = false
      var timeoutTimer
      var failureResponse = {
        body: undefined,
        headers: {},
        statusCode: 0,
        method: method,
        url: uri,
        rawRequest: xhr
      }

      if ("json" in options && options.json !== false) {
        isJson = true
        headers["accept"] || headers["Accept"] || (headers["Accept"] = "application/json") //Don't override existing accept header declared by user
        if (method !== "GET" && method !== "HEAD") {
          headers["content-type"] || headers["Content-Type"] || (headers["Content-Type"] = "application/json") //Don't override existing accept header declared by user
          body = JSON.stringify(options.json === true ? body : options.json)
        }
      }

      xhr.onreadystatechange = readystatechange
      xhr.onload = loadFunc
      xhr.onerror = errorFunc
      // IE9 must have onprogress be set to a unique function.
      xhr.onprogress = function() {
        // IE must die
      }
      xhr.onabort = function() {
        aborted = true;
      }
      xhr.ontimeout = errorFunc
      xhr.open(method, uri, !sync, options.username, options.password)
      //has to be after open
      if (!sync) {
        xhr.withCredentials = !!options.withCredentials
      }
      // Cannot set timeout with sync request
      // not setting timeout on the xhr object, because of old webkits etc. not handling that correctly
      // both npm's request and jquery 1.x use this kind of timeout, so this is being consistent
      if (!sync && options.timeout > 0) {
        timeoutTimer = setTimeout(function() {
          if (aborted) return
          aborted = true//IE9 may still call readystatechange
          xhr.abort("timeout")
          var e = new Error("XMLHttpRequest timeout")
          e.code = "ETIMEDOUT"
          errorFunc(e)
        }, options.timeout)
      }

      if (xhr.setRequestHeader) {
        for (key in headers) {
          if (headers.hasOwnProperty(key)) {
            xhr.setRequestHeader(key, headers[key])
          }
        }
      } else if (options.headers && !isEmpty(options.headers)) {
        throw new Error("Headers cannot be set on an XDomainRequest object")
      }

      if ("responseType" in options) {
        xhr.responseType = options.responseType
      }

      if ("beforeSend" in options &&
        typeof options.beforeSend === "function"
      ) {
        options.beforeSend(xhr)
      }

      // Microsoft Edge browser sends "undefined" when send is called with undefined value.
      // XMLHttpRequest spec says to pass null as body to indicate no body
      // See https://github.com/naugtur/xhr/issues/100.
      xhr.send(body || null)

      return xhr

    }

    function getXml(xhr) {
      // xhr.responseXML will throw Exception "InvalidStateError" or "DOMException"
      // See https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseXML.
      try {
        if (xhr.responseType === "document") {
          return xhr.responseXML
        }
        var firefoxBugTakenEffect = xhr.responseXML && xhr.responseXML.documentElement.nodeName === "parsererror"
        if (xhr.responseType === "" && !firefoxBugTakenEffect) {
          return xhr.responseXML
        }
      } catch (e) {
      }

      return null
    }

    function noop() {
    }

    /***/
  }),
  /* 12 */
  /***/ (function(module, exports, __webpack_require__) {

    /* WEBPACK VAR INJECTION */
    (function(global) {
      var win;

      if (typeof window !== "undefined") {
        win = window;
      } else if (typeof global !== "undefined") {
        win = global;
      } else if (typeof self !== "undefined") {
        win = self;
      } else {
        win = {};
      }

      module.exports = win;

      /* WEBPACK VAR INJECTION */
    }.call(exports, __webpack_require__(13)))

    /***/
  }),
  /* 13 */
  /***/ (function(module, exports) {

    var g;

// This works in non-strict mode
    g = (function() {
      return this;
    })();

    try {
      // This works if eval is allowed (see CSP)
      g = g || Function("return this")() || (1, eval)("this");
    } catch (e) {
      // This works if the window reference is available
      if (typeof window === "object")
        g = window;
    }

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

    module.exports = g;

    /***/
  }),
  /* 14 */
  /***/ (function(module, exports, __webpack_require__) {

    var trim = __webpack_require__(15)
      , forEach = __webpack_require__(16)
      , isArray = function(arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    }

    module.exports = function(headers) {
      if (!headers)
        return {}

      var result = {}

      forEach(
        trim(headers).split('\n')
        , function(row) {
          var index = row.indexOf(':')
            , key = trim(row.slice(0, index)).toLowerCase()
            , value = trim(row.slice(index + 1))

          if (typeof (result[key]) === 'undefined') {
            result[key] = value
          } else if (isArray(result[key])) {
            result[key].push(value)
          } else {
            result[key] = [result[key], value]
          }
        }
      )

      return result
    }

    /***/
  }),
  /* 15 */
  /***/ (function(module, exports) {

    exports = module.exports = trim;

    function trim(str) {
      return str.replace(/^\s*|\s*$/g, '');
    }

    exports.left = function(str) {
      return str.replace(/^\s*/, '');
    };

    exports.right = function(str) {
      return str.replace(/\s*$/, '');
    };

    /***/
  }),
  /* 16 */
  /***/ (function(module, exports, __webpack_require__) {

    var isFunction = __webpack_require__(2)

    module.exports = forEach

    var toString = Object.prototype.toString
    var hasOwnProperty = Object.prototype.hasOwnProperty

    function forEach(list, iterator, context) {
      if (!isFunction(iterator)) {
        throw new TypeError('iterator must be a function')
      }

      if (arguments.length < 3) {
        context = this
      }

      if (toString.call(list) === '[object Array]')
        forEachArray(list, iterator, context)
      else if (typeof list === 'string')
        forEachString(list, iterator, context)
      else
        forEachObject(list, iterator, context)
    }

    function forEachArray(array, iterator, context) {
      for (var i = 0, len = array.length; i < len; i++) {
        if (hasOwnProperty.call(array, i)) {
          iterator.call(context, array[i], i, array)
        }
      }
    }

    function forEachString(string, iterator, context) {
      for (var i = 0, len = string.length; i < len; i++) {
        // no such thing as a sparse string.
        iterator.call(context, string.charAt(i), i, string)
      }
    }

    function forEachObject(object, iterator, context) {
      for (var k in object) {
        if (hasOwnProperty.call(object, k)) {
          iterator.call(context, object[k], k, object)
        }
      }
    }

    /***/
  }),
  /* 17 */
  /***/ (function(module, exports) {

    module.exports = extend

    var hasOwnProperty = Object.prototype.hasOwnProperty;

    function extend() {
      var target = {}

      for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
          if (hasOwnProperty.call(source, key)) {
            target[key] = source[key]
          }
        }
      }

      return target
    }

    /***/
  })
  /******/]);
